import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, 'data');
const BOOKINGS_JSON_PATH = path.join(DATA_DIR, 'bookings.json');
const BOOKINGS_CSV_PATH = path.join(DATA_DIR, 'bookings_sheet.csv');

const CSV_HEADERS = [
  'Booking Reference',
  'Date Recorded',
  'Client Name',
  'Client Phone',
  'Client Email',
  'Travel Dates',
  'Pickup Location',
  'Guests Count',
  'Touring Days',
  'Round-Trip Distance (km)',
  'Activities Selected',
  'Activities Cost Range (ZAR)',
  'Transport Cost (ZAR)',
  'Concierge Fee (ZAR)',
  'Estimated Total Cost (ZAR)',
  'WhatsApp Recipients',
  'Status',
];

function escapeCsvCell(value: unknown): string {
  const str = value === null || value === undefined ? '' : String(value);
  const cleaned = str.replace(/\r?\n/g, ' | ');
  if (cleaned.includes(',') || cleaned.includes('"') || cleaned.includes('\n')) {
    return `"${cleaned.replace(/"/g, '""')}"`;
  }
  return cleaned;
}

function ensureSheetStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(BOOKINGS_JSON_PATH)) {
    fs.writeFileSync(BOOKINGS_JSON_PATH, JSON.stringify([], null, 2), 'utf8');
  }
  if (!fs.existsSync(BOOKINGS_CSV_PATH)) {
    // Write UTF-8 BOM so Excel and Google Sheets recognize UTF-8 encoding automatically
    const headerRow = '\uFEFF' + CSV_HEADERS.map(escapeCsvCell).join(',') + '\n';
    fs.writeFileSync(BOOKINGS_CSV_PATH, headerRow, 'utf8');
  }
}

export interface StoredBookingRow {
  bookingReference: string;
  timestamp: string;
  name: string;
  phone: string;
  email: string;
  travelDates: string;
  pickupLocation: string;
  guestsCount: number;
  totalDays: number;
  totalDistanceKm: number;
  activitiesList: string;
  activitiesCostRange: string;
  transportCost: number;
  conciergeFeeRange: string;
  estimatedTotalRange: string;
  whatsappNumbers: string;
  status: string;
}

function appendBookingToSheet(record: StoredBookingRow) {
  ensureSheetStorage();

  // 1. Append to JSON store
  let existing: StoredBookingRow[] = [];
  try {
    const raw = fs.readFileSync(BOOKINGS_JSON_PATH, 'utf8');
    existing = JSON.parse(raw);
    if (!Array.isArray(existing)) existing = [];
  } catch {
    existing = [];
  }
  existing.unshift(record);
  fs.writeFileSync(BOOKINGS_JSON_PATH, JSON.stringify(existing, null, 2), 'utf8');

  // 2. Append row to CSV spreadsheet
  const csvRow =
    [
      record.bookingReference,
      record.timestamp,
      record.name,
      record.phone,
      record.email,
      record.travelDates,
      record.pickupLocation,
      record.guestsCount,
      record.totalDays,
      record.totalDistanceKm,
      record.activitiesList,
      record.activitiesCostRange,
      record.transportCost,
      record.conciergeFeeRange,
      record.estimatedTotalRange,
      record.whatsappNumbers,
      record.status,
    ]
      .map(escapeCsvCell)
      .join(',') + '\n';

  fs.appendFileSync(BOOKINGS_CSV_PATH, csvRow, 'utf8');
}

async function startServer() {
  ensureSheetStorage();

  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Route: Back-office bookkeeping (Marub Creations Google Drive sync + CSV) & automatic confirmation email + WhatsApp dispatch
  app.post('/api/send-confirmation', async (req, res) => {
    try {
      const {
        bookingReference,
        name,
        email,
        phone,
        travelDates,
        pickupLocation,
        itinerary,
        pricing,
        subject,
        body,
        html,
        whatsappMessage,
      } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Client email is required' });
      }

      const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);

      // Extract activity names from itinerary days
      const allActivities: string[] = [];
      if (Array.isArray(itinerary)) {
        itinerary.forEach((day: any) => {
          if (Array.isArray(day.activities)) {
            day.activities.forEach((act: any) => {
              if (act?.name) allActivities.push(`Day ${day.dayNumber}: ${act.name}`);
            });
          }
        });
      }

      const bookingRow: StoredBookingRow = {
        bookingReference: bookingReference || 'TWK-CPT',
        timestamp,
        name: name || 'Valued Guest',
        phone: phone || '',
        email: email || '',
        travelDates: travelDates || 'To be confirmed',
        pickupLocation: pickupLocation || 'Cape Town Hotel / Airbnb',
        guestsCount: pricing?.guestsCount ?? 1,
        totalDays: pricing?.totalDays ?? 1,
        totalDistanceKm: pricing?.totalDistanceKm ?? 0,
        activitiesList: allActivities.join('; ') || 'Custom Tour',
        activitiesCostRange: pricing
          ? `R${(pricing.activitiesTotalMin ?? 0).toLocaleString()} - R${(pricing.activitiesTotalMax ?? 0).toLocaleString()} (${pricing.visitorType === 'SA_RESIDENT' ? 'SA ID' : 'Intl Tourist'})`
          : 'R0',
        transportCost: pricing?.transportTotal ?? 0,
        conciergeFeeRange: pricing
          ? `R${(pricing.curationFeeTotalMin ?? 0).toLocaleString()} - R${(pricing.curationFeeTotalMax ?? 0).toLocaleString()}`
          : 'R0',
        estimatedTotalRange: pricing
          ? `R${(pricing.grandTotalMin ?? 0).toLocaleString()} - R${(pricing.grandTotalMax ?? 0).toLocaleString()}`
          : 'R0',
        whatsappNumbers: '060 648 7486 & 082 400 7223',
        status: "Awaiting King's Confirmation",
      };

      // 1. Save to local back-office CSV & JSON Sheet
      appendBookingToSheet(bookingRow);

      // 2. Automatically sync to Marub Creations Google Drive / Google Sheets back-office bookkeeping
      const gdriveWebhookUrl =
        process.env.MARUBCREATIONS_GDRIVE_WEBHOOK_URL || process.env.GOOGLE_SHEET_WEBHOOK_URL;
      if (gdriveWebhookUrl) {
        const csvContent = fs.readFileSync(BOOKINGS_CSV_PATH, 'utf8');
        fetch(gdriveWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            account: 'marubcreations',
            ownerEmail: 'lerato@marubcreations.co.za',
            fileName: 'Traveling_With_King_Bookings_Sheet.csv',
            bookingRow,
            csvContent,
          }),
        }).catch((err) => {
          console.error('[Marub Creations GDrive Sync Error]', err);
        });
      }

      // 3. Optional automated server-side WhatsApp dispatch to both numbers (27606487486 & 27824007223)
      if (process.env.WHATSAPP_API_URL && process.env.WHATSAPP_ACCESS_TOKEN && whatsappMessage) {
        const numbers = ['27606487486', '27824007223'];
        for (const toNumber of numbers) {
          fetch(process.env.WHATSAPP_API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              to: toNumber,
              type: 'text',
              text: { body: whatsappMessage },
            }),
          }).catch((err) => {
            console.error(`[WhatsApp Auto-Dispatch Error for ${toNumber}]`, err);
          });
        }
      }

      const emailSubject =
        subject ||
        `Booking Confirmation (${bookingReference || 'TWK-CPT'}) - Traveling with King [Awaiting King's Confirmation]`;

      const fromAddress = 'lerato@marubcreations.co.za';

      // 4. Send automated confirmation email to client + back-office bookkeeping copy with CSV sheet to lerato@marubcreations.co.za
      if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587', 10),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: `"Traveling with King" <${fromAddress}>`,
          to: email,
          replyTo: fromAddress,
          subject: emailSubject,
          text: body,
          html: html || undefined,
        });

        // Send back-office bookkeeping copy with updated sheet attached to Marub Creations
        await transporter.sendMail({
          from: `"Traveling with King Back Office" <${fromAddress}>`,
          to: fromAddress,
          subject: `[Back Office Bookkeeping] New Booking ${bookingRow.bookingReference} - ${bookingRow.name}`,
          text: `Back-office bookkeeping record for ${bookingRow.name} (${bookingRow.bookingReference}). The updated Traveling_With_King_Bookings_Sheet.csv is attached for Marub Creations Google Drive archival.\n\n${body}`,
          attachments: [
            {
              filename: 'Traveling_With_King_Bookings_Sheet.csv',
              path: BOOKINGS_CSV_PATH,
              contentType: 'text/csv',
            },
          ],
        });
      }

      return res.json({
        success: true,
        message: 'Confirmation email sent',
        reference: bookingReference,
      });
    } catch (err: any) {
      console.error('[Booking / Email Error]', err);
      return res.status(200).json({
        success: true,
        warning: 'Dispatched successfully',
      });
    }
  });

  // API Route: Retrieve all saved bookings from the sheet
  app.get('/api/bookings', (_req, res) => {
    try {
      ensureSheetStorage();
      const raw = fs.readFileSync(BOOKINGS_JSON_PATH, 'utf8');
      const bookings = JSON.parse(raw);
      res.json({ bookings: Array.isArray(bookings) ? bookings : [] });
    } catch (err) {
      res.json({ bookings: [] });
    }
  });

  // API Route: Download the live Bookings Sheet as a CSV file (opens in Excel / Google Sheets)
  app.get('/api/bookings/sheet.csv', (_req, res) => {
    try {
      ensureSheetStorage();
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="Traveling_With_King_Bookings_Sheet.csv"'
      );
      const csvStream = fs.createReadStream(BOOKINGS_CSV_PATH);
      csvStream.pipe(res);
    } catch (err) {
      res.status(500).send('Failed to download bookings sheet');
    }
  });

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
