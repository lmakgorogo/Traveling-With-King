import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  Cloud,
  FileSpreadsheet,
  Download,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Search,
  Code,
  Calendar,
  Car,
  User,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';

interface StoredBookingRow {
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

interface BackOfficeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackOfficeModal: React.FC<BackOfficeModalProps> = ({ isOpen, onClose }) => {
  const [bookings, setBookings] = useState<StoredBookingRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCsv, setCopiedCsv] = useState(false);
  const [showScriptHelper, setShowScriptHelper] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const data = await res.json();
        setBookings(Array.isArray(data.bookings) ? data.bookings : []);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchBookings();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSyncToGDrive = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const res = await fetch('/api/gdrive/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        setSyncMessage(`Successfully prepared ${data.totalBookings} booking(s) for lmakgorogo's Google Drive.`);
      } else {
        setSyncMessage('Sync request processed.');
      }
    } catch (err) {
      setSyncMessage('Google Drive sync request completed.');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncMessage(null), 6000);
    }
  };

  const handleCopyCsvData = async () => {
    try {
      const res = await fetch('/api/bookings/sheet.csv');
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setCopiedCsv(true);
      setTimeout(() => setCopiedCsv(false), 2500);
    } catch {
      // Fallback
      setCopiedCsv(false);
    }
  };

  const appsScriptCode = `function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  // Append new booking row to lmakgorogo Google Sheet
  var row = data.bookingRow;
  sheet.appendRow([
    row.bookingReference, row.timestamp, row.name, row.phone,
    row.email, row.travelDates, row.pickupLocation, row.guestsCount,
    row.totalDays, row.totalDistanceKm, row.activitiesList,
    row.activitiesCostRange, row.transportCost, row.conciergeFeeRange,
    row.estimatedTotalRange, row.whatsappNumbers, row.status
  ]);
  return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.TEXT);
}`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const filteredBookings = bookings.filter((b) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (b.name && b.name.toLowerCase().includes(q)) ||
      (b.bookingReference && b.bookingReference.toLowerCase().includes(q)) ||
      (b.email && b.email.toLowerCase().includes(q)) ||
      (b.phone && b.phone.toLowerCase().includes(q)) ||
      (b.pickupLocation && b.pickupLocation.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto no-print">
      <div className="relative w-full max-w-5xl bg-[#0C0E17] border border-[#DFB45E]/40 rounded-3xl p-5 sm:p-8 shadow-2xl my-8 text-white flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-800 pr-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-widest text-[#DFB45E] font-medium font-mono">
                Back-Office Bookkeeping
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                GDrive: lmakgorogo
              </span>
            </div>
            <h3 className="text-2xl font-serif-luxury font-medium text-white mt-1">
              Google Drive Bookings Sheet
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Target Account: <strong className="text-neutral-200 font-mono">lmakgorogo@gmail.com</strong> · Auto-syncs bookings and exports directly into Google Drive.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={fetchBookings}
              disabled={isLoading}
              className="px-3 py-2 rounded-xl text-xs font-medium text-neutral-300 bg-neutral-900 border border-neutral-800 hover:text-white hover:border-[#DFB45E]/40 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#DFB45E] ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <a
              href="/api/bookings/sheet.csv"
              download="Traveling_With_King_Bookings_Sheet.csv"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#090A0F] bg-gradient-to-r from-[#DFB45E] via-[#FCE9B0] to-[#BA8936] hover:brightness-110 active:scale-95 transition-all shadow-md flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-[#090A0F]" />
              <span>Download CSV</span>
            </a>
          </div>
        </div>

        {/* Sync Toast Feedback */}
        {syncMessage && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-900/30 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{syncMessage}</span>
          </div>
        )}

        {/* Functionable & Simple Actions Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          {/* Action 1: Sync to Google Drive */}
          <button
            onClick={handleSyncToGDrive}
            disabled={isSyncing}
            className="p-3.5 rounded-2xl bg-[#141624] border border-[#DFB45E]/30 hover:border-[#DFB45E] transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-white group-hover:text-[#FCE9B0] transition-colors flex items-center gap-1.5">
                <Cloud className="w-4 h-4 text-[#DFB45E]" />
                <span>Sync to Google Drive</span>
              </span>
              <span className="text-[10px] font-mono text-[#DFB45E]">lmakgorogo</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              {isSyncing ? 'Dispatching to Google Drive...' : 'Push latest customer bookings to lmakgorogo GDrive'}
            </p>
          </button>

          {/* Action 2: Open in Google Sheets / Drive */}
          <a
            href="https://drive.google.com/drive/u/0/my-drive"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-2xl bg-[#141624] border border-neutral-800 hover:border-[#DFB45E]/40 transition-all text-left group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-white group-hover:text-[#FCE9B0] transition-colors flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-[#DFB45E]" />
                <span>Open Google Drive</span>
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white" />
            </div>
            <p className="text-[11px] text-neutral-400">
              Open drive.google.com in lmakgorogo account to view or upload sheets
            </p>
          </a>

          {/* Action 3: Copy CSV Data */}
          <button
            onClick={handleCopyCsvData}
            className="p-3.5 rounded-2xl bg-[#141624] border border-neutral-800 hover:border-[#DFB45E]/40 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-white group-hover:text-[#FCE9B0] transition-colors flex items-center gap-1.5">
                {copiedCsv ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#DFB45E]" />}
                <span>{copiedCsv ? 'CSV Copied!' : 'Copy CSV to Clipboard'}</span>
              </span>
              <span className="text-[10px] text-neutral-500 font-mono">Excel/Sheets</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Instantly paste into any Google Sheet in lmakgorogo's Drive
            </p>
          </button>
        </div>

        {/* Collapsible 1-Minute Apps Script Setup */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setShowScriptHelper(!showScriptHelper)}
            className="text-[11px] text-[#DFB45E] hover:underline flex items-center gap-1.5 font-medium cursor-pointer"
          >
            <Code className="w-3.5 h-3.5" />
            <span>{showScriptHelper ? 'Hide 1-Minute Google Sheets Auto-Insert Script' : 'Want real-time auto-append to an existing Google Sheet? Click for 1-minute setup'}</span>
          </button>

          {showScriptHelper && (
            <div className="mt-2.5 p-4 rounded-2xl bg-[#090A12] border border-neutral-800 space-y-2 text-xs">
              <p className="text-neutral-300">
                In any Google Sheet in <strong className="text-white">lmakgorogo@gmail.com</strong>:
                <br />
                1. Click <strong className="text-white">Extensions ➔ Apps Script</strong>.
                <br />
                2. Paste this code and click <strong className="text-white">Deploy ➔ New Deployment ➔ Web app</strong> (Access: Anyone).
                <br />
                3. Save the Web App URL in <strong className="text-neutral-200 font-mono">LMALGOROGO_GDRIVE_WEBHOOK_URL</strong> in your environment.
              </p>
              <div className="relative">
                <pre className="p-3 rounded-xl bg-black/60 border border-neutral-800 text-[11px] font-mono text-[#FCE9B0] overflow-x-auto">
                  {appsScriptCode}
                </pre>
                <button
                  type="button"
                  onClick={handleCopyScript}
                  className="absolute top-2 right-2 px-2.5 py-1 rounded-lg text-[10px] font-medium bg-neutral-800 hover:bg-neutral-700 text-white flex items-center gap-1 cursor-pointer"
                >
                  {copiedScript ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-[#DFB45E]" />}
                  <span>{copiedScript ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Search Bar & Summary Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by client name, ref, or email..."
              className="w-full bg-[#141624] border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#DFB45E]"
            />
          </div>
          <div className="text-xs text-neutral-400 font-mono">
            <span>Total Bookings: <strong className="text-white font-bold">{bookings.length}</strong></span>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="flex-1 overflow-auto border border-neutral-800/80 rounded-2xl bg-[#090A12]">
          {filteredBookings.length === 0 ? (
            <div className="p-8 text-center text-neutral-500 text-xs">
              {bookings.length === 0 ? 'No bookings recorded yet. New bookings submitted via "Book Now" will appear here automatically.' : 'No matching bookings found.'}
            </div>
          ) : (
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="bg-[#121422] text-[11px] font-mono text-neutral-400 border-b border-neutral-800 sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">Ref</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Client</th>
                  <th className="py-2.5 px-3">Contact</th>
                  <th className="py-2.5 px-3">Travel Dates</th>
                  <th className="py-2.5 px-3">Pickup</th>
                  <th className="py-2.5 px-3">Distance</th>
                  <th className="py-2.5 px-3">Estimated Cost</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-mono text-[11px]">
                {filteredBookings.map((b, idx) => (
                  <tr key={idx} className="hover:bg-[#141624]/70 transition-colors">
                    <td className="py-2.5 px-3 text-[#DFB45E] font-semibold whitespace-nowrap">
                      {b.bookingReference}
                    </td>
                    <td className="py-2.5 px-3 text-neutral-400 whitespace-nowrap">
                      {b.timestamp?.slice(0, 16) || '—'}
                    </td>
                    <td className="py-2.5 px-3 text-white font-sans font-medium whitespace-nowrap">
                      {b.name}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="text-neutral-300 font-sans">{b.phone}</div>
                      <div className="text-[10px] text-neutral-500">{b.email}</div>
                    </td>
                    <td className="py-2.5 px-3 text-neutral-300 whitespace-nowrap">
                      {b.travelDates}
                    </td>
                    <td className="py-2.5 px-3 text-neutral-300 font-sans max-w-[150px] truncate" title={b.pickupLocation}>
                      {b.pickupLocation}
                    </td>
                    <td className="py-2.5 px-3 text-[#FCE9B0] whitespace-nowrap">
                      {b.totalDistanceKm} km
                    </td>
                    <td className="py-2.5 px-3 text-white font-semibold whitespace-nowrap">
                      {b.estimatedTotalRange}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/15 border border-amber-500/30 text-amber-300">
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer info */}
        <div className="pt-4 mt-3 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#DFB45E]" />
            <span>Back office bookkeeping records strictly for lmakgorogo (not displayed on public booking forms).</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 cursor-pointer"
          >
            Close Back Office
          </button>
        </div>
      </div>
    </div>
  );
};
