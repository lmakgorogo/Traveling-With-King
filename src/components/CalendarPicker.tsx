import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Check } from 'lucide-react';

interface CalendarPickerProps {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  totalDaysNeeded: number;
  onSelectRange: (start: string, end: string) => void;
}

export const CalendarPicker: React.FC<CalendarPickerProps> = ({
  startDate,
  endDate,
  totalDaysNeeded,
  onSelectRange,
}) => {
  // Current viewing month
  const today = useMemo(() => new Date(), []);
  
  const initialMonth = useMemo(() => {
    if (startDate) {
      const d = new Date(startDate);
      if (!isNaN(d.getTime())) return new Date(d.getFullYear(), d.getMonth(), 1);
    }
    return new Date(today.getFullYear(), today.getMonth(), 1);
  }, [startDate, today]);

  const [currentMonth, setCurrentMonth] = useState<Date>(initialMonth);

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Generate calendar days for currentMonth
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: Array<{
      dateStr: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isPast: boolean;
    }> = [];

    // Empty lead days
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({
        dateStr: '',
        dayNumber: 0,
        isCurrentMonth: false,
        isPast: true,
      });
    }

    const todayStr = today.toISOString().split('T')[0];

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const monthFormatted = String(month + 1).padStart(2, '0');
      const dayFormatted = String(d).padStart(2, '0');
      const dateStr = `${year}-${monthFormatted}-${dayFormatted}`;
      const isPast = dateStr < todayStr;

      days.push({
        dateStr,
        dayNumber: d,
        isCurrentMonth: true,
        isPast,
      });
    }

    return days;
  }, [currentMonth, today]);

  const handleDayClick = (dateStr: string, isPast: boolean) => {
    if (!dateStr || isPast) return;

    if (!startDate || (startDate && endDate)) {
      // First click: sets start date
      onSelectRange(dateStr, '');
    } else {
      // Second click: user picks end date
      if (dateStr < startDate) {
        // Clicked earlier: make this the new start date
        onSelectRange(dateStr, '');
      } else {
        onSelectRange(startDate, dateStr);
      }
    }
  };

  const monthYearLabel = currentMonth.toLocaleDateString('en-ZA', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="bg-[#121422] border border-[#DFB45E]/30 rounded-2xl p-4 sm:p-5 shadow-lg">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-[#DFB45E]" />
          <h4 className="text-sm font-semibold text-white capitalize">{monthYearLabel}</h4>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={prevMonth}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-neutral-500 uppercase tracking-wider mb-2">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, idx) => {
          if (!day.isCurrentMonth) {
            return <div key={`empty-${idx}`} className="h-9 w-full" />;
          }

          const isStart = day.dateStr === startDate;
          const isEnd = day.dateStr === endDate;
          const isInRange =
            startDate && endDate && day.dateStr > startDate && day.dateStr < endDate;

          return (
            <button
              key={day.dateStr}
              type="button"
              disabled={day.isPast}
              onClick={() => handleDayClick(day.dateStr, day.isPast)}
              className={`h-9 w-full rounded-xl text-xs font-mono font-medium flex items-center justify-center transition-all cursor-pointer ${
                day.isPast
                  ? 'text-neutral-600 opacity-40 cursor-not-allowed'
                  : isStart || isEnd
                  ? 'bg-gradient-to-r from-[#DFB45E] to-[#BA8936] text-[#090A0F] font-bold shadow-md scale-105 z-10'
                  : isInRange
                  ? 'bg-[#DFB45E]/20 text-[#FCE9B0] border border-[#DFB45E]/30'
                  : 'text-neutral-200 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              {day.dayNumber}
            </button>
          );
        })}
      </div>

      {/* Date Input Pickers */}
      <div className="mt-4 pt-3 border-t border-neutral-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="text-[11px] text-neutral-400 block mb-1">
            Start Date (Trip Departure)
          </label>
          <input
            type="date"
            value={startDate}
            min={today.toISOString().split('T')[0]}
            onChange={(e) => {
              const val = e.target.value;
              if (val) {
                onSelectRange(val, endDate && endDate >= val ? endDate : '');
              } else {
                onSelectRange('', '');
              }
            }}
            className="w-full bg-[#181A2A] border border-neutral-700/80 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#DFB45E]"
          />
        </div>

        <div>
          <label className="text-[11px] text-neutral-400 block mb-1">
            End Date (Trip Conclusion)
          </label>
          <input
            type="date"
            value={endDate}
            min={startDate || today.toISOString().split('T')[0]}
            onChange={(e) => {
              const val = e.target.value;
              if (val) {
                onSelectRange(startDate || val, val);
              } else {
                onSelectRange(startDate, '');
              }
            }}
            className="w-full bg-[#181A2A] border border-neutral-700/80 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#DFB45E]"
          />
        </div>
      </div>

      {/* Selected Range Display */}
      {startDate && (
        <div className="mt-3 p-2.5 rounded-xl bg-[#171A2B] border border-[#DFB45E]/20 text-xs flex items-center justify-between text-[#FCE9B0]">
          <span>
            {endDate ? (
              <>
                Selected Dates: <strong className="text-white font-mono">{startDate}</strong> to{' '}
                <strong className="text-white font-mono">{endDate}</strong>
              </>
            ) : (
              <>
                Start Date: <strong className="text-white font-mono">{startDate}</strong> (Select end date on calendar)
              </>
            )}
          </span>
          <button
            type="button"
            onClick={() => onSelectRange('', '')}
            className="text-[11px] text-neutral-400 hover:text-white underline cursor-pointer ml-2"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};
