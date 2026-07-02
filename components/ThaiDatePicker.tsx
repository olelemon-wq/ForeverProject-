'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface ThaiDatePickerProps {
  value?: string; // YYYY-MM-DD (for single mode)
  onChange?: (date: string) => void; // (for single mode)
  mode?: 'single' | 'range';
  rangeStart?: string; // YYYY-MM-DD (for range mode)
  rangeEnd?: string; // YYYY-MM-DD (for range mode)
  onChangeRange?: (start: string, end: string) => void; // (for range mode)
  align?: 'left' | 'right';
  placeholder?: string;
  variant?: 'icon' | 'input';
  buttonClassName?: string;
  iconClassName?: string;
}

const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

const THAI_WEEKDAYS = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

const formatDisplayThaiDate = (val: string) => {
  if (!val) return '';
  const parts = val.split('-');
  if (parts.length !== 3) return val;
  const yyyy = parseInt(parts[0]);
  const mm = parts[1];
  const dd = parts[2];
  return `${dd}/${mm}/${yyyy + 543}`;
};

export default function ThaiDatePicker({
  value,
  onChange,
  mode = 'single',
  rangeStart,
  rangeEnd,
  onChangeRange,
  align = 'right',
  placeholder = 'เลือกวันที่',
  variant = 'icon',
  buttonClassName = "p-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-250 rounded-lg text-stone-600 transition flex items-center justify-center cursor-pointer",
  iconClassName = "w-3.5 h-3.5"
}: ThaiDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [positionAbove, setPositionAbove] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // States for Range Mode
  const [tempStart, setTempStart] = useState<string | null>(rangeStart || null);
  const [tempEnd, setTempEnd] = useState<string | null>(rangeEnd || null);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  // Parse initial date or default to current date for calendar view viewports
  const getInitialViewDate = () => {
    if (mode === 'range' && rangeStart) {
      return new Date(rangeStart);
    }
    if (mode === 'single' && value) {
      return new Date(value);
    }
    return new Date();
  };

  const parsedDate = getInitialViewDate();
  const initialYear = isNaN(parsedDate.getTime()) ? new Date().getFullYear() : parsedDate.getFullYear();
  const initialMonth = isNaN(parsedDate.getTime()) ? new Date().getMonth() : parsedDate.getMonth();

  const [currentMonth, setCurrentMonth] = useState(initialMonth);
  const [currentYear, setCurrentYear] = useState(initialYear);

  // Reset range and calendar viewport when opening popover
  useEffect(() => {
    if (isOpen) {
      if (mode === 'range') {
        setTempStart(rangeStart || null);
        setTempEnd(rangeEnd || null);
        if (rangeStart) {
          const d = new Date(rangeStart);
          if (!isNaN(d.getTime())) {
            setCurrentMonth(d.getMonth());
            setCurrentYear(d.getFullYear());
          }
        }
      } else {
        if (value) {
          const d = new Date(value);
          if (!isNaN(d.getTime())) {
            setCurrentMonth(d.getMonth());
            setCurrentYear(d.getFullYear());
          }
        }
      }
      setHoveredDate(null);
    }
  }, [isOpen, mode, rangeStart, rangeEnd, value]);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Adjust calendar popover alignment direction based on viewport space
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      // If there is less than 320px below, but more space above, open upwards
      if (spaceBelow < 320 && spaceAbove > spaceBelow) {
        setPositionAbove(true);
      } else {
        setPositionAbove(false);
      }
    }
  }, [isOpen]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Generate calendar days
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);

  // Previous month days to pad the first week
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

  const calendarDays = [];

  // Pad from previous month
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    calendarDays.push({
      day,
      month: prevMonth,
      year: prevYear,
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      day: i,
      month: currentMonth,
      year: currentYear,
      isCurrentMonth: true,
    });
  }

  // Next month days to pad to complete the grid (usually 42 cells for 6 rows)
  const remainingCells = 42 - calendarDays.length;
  const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
  const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
  for (let i = 1; i <= remainingCells; i++) {
    calendarDays.push({
      day: i,
      month: nextMonth,
      year: nextYear,
      isCurrentMonth: false,
    });
  }

  const handleDateClick = (day: number, month: number, year: number) => {
    const yyyy = year.toString();
    const mm = (month + 1).toString().padStart(2, '0');
    const dd = day.toString().padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;

    if (mode === 'range') {
      if (!tempStart || (tempStart && tempEnd)) {
        // Start new range selection
        setTempStart(dateStr);
        setTempEnd(null);
      } else {
        // We already have a start date and no end date
        if (dateStr < tempStart) {
          // If clicked date is before start date, set as new start date
          setTempStart(dateStr);
        } else {
          // Set as end date and commit range
          setTempEnd(dateStr);
          if (onChangeRange) {
            onChangeRange(tempStart, dateStr);
          }
          setIsOpen(false);
        }
      }
    } else {
      // Single selection mode
      if (onChange) {
        onChange(dateStr);
      }
      setIsOpen(false);
    }
  };

  const handleCellMouseEnter = (day: number, month: number, year: number) => {
    if (mode === 'range' && tempStart && !tempEnd) {
      const yyyy = year.toString();
      const mm = (month + 1).toString().padStart(2, '0');
      const dd = day.toString().padStart(2, '0');
      setHoveredDate(`${yyyy}-${mm}-${dd}`);
    }
  };

  const isSelected = (day: number, month: number, year: number) => {
    const yyyy = year.toString();
    const mm = (month + 1).toString().padStart(2, '0');
    const dd = day.toString().padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;

    if (mode === 'range') {
      return tempStart === dateStr || tempEnd === dateStr || (!!tempStart && !tempEnd && hoveredDate === dateStr);
    } else {
      if (!value) return false;
      const parts = value.split('-');
      if (parts.length !== 3) return false;
      return parseInt(parts[0]) === year && parseInt(parts[1]) === (month + 1) && parseInt(parts[2]) === day;
    }
  };

  const isInRange = (day: number, month: number, year: number) => {
    if (mode !== 'range' || !tempStart) return false;
    const yyyy = year.toString();
    const mm = (month + 1).toString().padStart(2, '0');
    const dd = day.toString().padStart(2, '0');
    const currentStr = `${yyyy}-${mm}-${dd}`;

    if (tempEnd) {
      return currentStr > tempStart && currentStr < tempEnd;
    }

    if (hoveredDate) {
      if (hoveredDate > tempStart) {
        return currentStr > tempStart && currentStr < hoveredDate;
      } else if (hoveredDate < tempStart) {
        return currentStr > hoveredDate && currentStr < tempStart;
      }
    }

    return false;
  };

  const isToday = (day: number, month: number, year: number) => {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
  };

  return (
    <div className={`relative inline-block text-left ${variant === 'input' ? 'w-full' : 'shrink-0'}`} ref={containerRef}>
      {variant === 'icon' ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={buttonClassName}
          title="เลือกวันจากปฏิทิน"
        >
          <CalendarIcon className={iconClassName} />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-2 py-1.5 bg-white border border-stone-200 rounded-lg text-[11px] focus:outline-none focus:border-emerald-500 text-left flex items-center justify-between cursor-pointer"
        >
          <span className={value ? "text-stone-800" : "text-stone-400"}>
            {value ? formatDisplayThaiDate(value) : placeholder}
          </span>
          <CalendarIcon className="w-3.5 h-3.5 text-stone-400" />
        </button>
      )}

      {isOpen && (
        <div
          className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} ${positionAbove ? 'bottom-full mb-1' : 'top-full mt-1'} w-64 bg-white border border-stone-250 rounded-xl shadow-xl z-50 p-3 select-none`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 hover:bg-stone-100 rounded-lg transition text-stone-600 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="text-[12px] font-bold text-stone-800">
              {THAI_MONTHS[currentMonth]} {currentYear + 543}
            </div>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 hover:bg-stone-100 rounded-lg transition text-stone-600 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Weekday labels */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {THAI_WEEKDAYS.map((day, idx) => (
              <div
                key={day}
                className={`text-[10px] font-bold ${
                  idx === 0 ? 'text-red-500' : idx === 6 ? 'text-blue-500' : 'text-stone-500'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((cell, idx) => {
              const selected = isSelected(cell.day, cell.month, cell.year);
              const inRange = isInRange(cell.day, cell.month, cell.year);
              const today = isToday(cell.day, cell.month, cell.year);
              return (
                <button
                  key={`${cell.year}-${cell.month}-${cell.day}-${idx}`}
                  type="button"
                  onClick={() => handleDateClick(cell.day, cell.month, cell.year)}
                  onMouseEnter={() => handleCellMouseEnter(cell.day, cell.month, cell.year)}
                  className={`h-7 w-7 text-[10px] font-medium flex items-center justify-center cursor-pointer transition ${
                    !cell.isCurrentMonth
                      ? 'text-stone-300 hover:bg-stone-50 rounded-lg'
                      : selected
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg'
                      : inRange
                      ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200/80 rounded-none'
                      : today
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 rounded-lg'
                      : 'text-stone-700 hover:bg-stone-100 rounded-lg'
                  }`}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>

          {/* Footer controls */}
          <div className="flex items-center justify-between border-t border-stone-100 mt-2 pt-2 text-[10px]">
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                const dateStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
                if (mode === 'range') {
                  setTempStart(dateStr);
                  setTempEnd(dateStr);
                  if (onChangeRange) {
                    onChangeRange(dateStr, dateStr);
                  }
                } else {
                  if (onChange) {
                    onChange(dateStr);
                  }
                }
                setIsOpen(false);
              }}
              className="text-emerald-700 font-bold hover:underline cursor-pointer"
            >
              วันนี้
            </button>
            <button
              type="button"
              onClick={() => {
                if (mode === 'range') {
                  setTempStart(null);
                  setTempEnd(null);
                  if (onChangeRange) {
                    onChangeRange('', '');
                  }
                } else {
                  if (onChange) {
                    onChange('');
                  }
                }
                setIsOpen(false);
              }}
              className="text-stone-500 font-bold hover:underline cursor-pointer"
            >
              ล้างค่า
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
