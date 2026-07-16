'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface ThaiDatePickerProps {
  value?: string; // YYYY-MM-DD (single mode)
  onChange?: (date: string) => void;
  mode?: 'single' | 'range';
  rangeStart?: string;
  rangeEnd?: string;
  onChangeRange?: (start: string, end: string) => void;
  align?: 'left' | 'right';
  placeholder?: string;
  variant?: 'icon' | 'input';
  buttonClassName?: string;
  iconClassName?: string;
  /** Day/month hidden — scroll พ.ศ. only; value still YYYY-01-01 */
  yearOnly?: boolean;
}

const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
];

const THAI_WEEKDAYS = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
const ITEM_H = 40;
const VISIBLE = 3;

function daysInMonth(year: number, monthIndex: number) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function formatDisplayThaiDate(val: string, yearOnly?: boolean) {
  if (!val) return '';
  const parts = val.split('-');
  if (parts.length !== 3) return val;
  const yyyy = parseInt(parts[0], 10);
  const mm = parseInt(parts[1], 10);
  const dd = parseInt(parts[2], 10);
  if (yearOnly) return `พ.ศ. ${yyyy + 543}`;
  return `${dd} ${THAI_MONTHS[mm - 1]} ${yyyy + 543}`;
}

function parseYmd(val?: string) {
  const now = new Date();
  if (!val) {
    return { year: now.getFullYear(), month: now.getMonth(), day: now.getDate() };
  }
  const [y, m, d] = val.split('-').map((n) => parseInt(n, 10));
  if (!y || !m || !d) {
    return { year: now.getFullYear(), month: now.getMonth(), day: now.getDate() };
  }
  return { year: y, month: m - 1, day: d };
}

function toYmd(year: number, monthIndex: number, day: number) {
  const maxDay = daysInMonth(year, monthIndex);
  const safeDay = Math.min(day, maxDay);
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(safeDay).padStart(2, '0')}`;
}

function WheelColumn({
  items,
  value,
  onChange,
  labelFor,
}: {
  items: number[];
  value: number;
  onChange: (v: number) => void;
  labelFor: (v: number) => string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const ignoreScroll = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToValue = useCallback((v: number, smooth: boolean) => {
    const el = ref.current;
    if (!el) return;
    const idx = items.indexOf(v);
    if (idx < 0) return;
    ignoreScroll.current = true;
    el.scrollTo({ top: idx * ITEM_H, behavior: smooth ? 'smooth' : 'auto' });
    window.setTimeout(() => {
      ignoreScroll.current = false;
    }, smooth ? 180 : 0);
  }, [items]);

  useEffect(() => {
    scrollToValue(value, false);
  }, [value, scrollToValue]);

  const handleScroll = () => {
    if (ignoreScroll.current) return;
    const el = ref.current;
    if (!el) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const idx = Math.round(el.scrollTop / ITEM_H);
      const clamped = Math.max(0, Math.min(items.length - 1, idx));
      const next = items[clamped];
      el.scrollTo({ top: clamped * ITEM_H, behavior: 'smooth' });
      if (next !== value) onChange(next);
    }, 80);
  };

  const pad = ((VISIBLE - 1) / 2) * ITEM_H;

  return (
    <div className="relative h-[120px] flex-1 overflow-hidden">
      <div
        ref={ref}
        onScroll={handleScroll}
        className="h-full overflow-y-auto overscroll-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollSnapType: 'y mandatory' }}
      >
        <div style={{ height: pad }} />
        {items.map((item) => {
          const active = item === value;
          return (
            <button
              key={item}
              type="button"
              onClick={() => {
                onChange(item);
                scrollToValue(item, true);
              }}
              className={`flex w-full shrink-0 items-center justify-center text-sm transition ${
                active ? 'font-bold text-[#0071e3]' : 'font-medium text-stone-400'
              }`}
              style={{ height: ITEM_H, scrollSnapAlign: 'center' }}
            >
              {labelFor(item)}
            </button>
          );
        })}
        <div style={{ height: pad }} />
      </div>
    </div>
  );
}

function ScrollDatePanel({
  value,
  yearOnly,
  onConfirm,
  onClear,
}: {
  value?: string;
  yearOnly?: boolean;
  onConfirm: (ymd: string) => void;
  onClear: () => void;
}) {
  const initial = parseYmd(value);
  const [year, setYear] = useState(initial.year);
  const [month, setMonth] = useState(initial.month);
  const [day, setDay] = useState(initial.day);

  useEffect(() => {
    const next = parseYmd(value);
    setYear(next.year);
    setMonth(next.month);
    setDay(Math.min(next.day, daysInMonth(next.year, next.month)));
  }, [value]);

  useEffect(() => {
    const max = daysInMonth(year, month);
    if (day > max) setDay(max);
  }, [year, month, day]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 150 }, (_, i) => currentYear + 5 - i);
  const months = Array.from({ length: 12 }, (_, i) => i);
  const days = Array.from({ length: daysInMonth(year, month) }, (_, i) => i + 1);

  return (
    <div className="w-[min(100vw-2rem,320px)] select-none rounded-2xl border border-stone-200 bg-white p-3 shadow-xl">
      <div className="mb-1.5 flex gap-1 px-1">
        {!yearOnly && (
          <>
            <div className="flex-1 text-center text-[10px] font-semibold text-stone-400">วัน</div>
            <div className="flex-1 text-center text-[10px] font-semibold text-stone-400">เดือน</div>
          </>
        )}
        <div className="flex-1 text-center text-[10px] font-semibold text-stone-400">พ.ศ.</div>
      </div>
      <div className="relative flex gap-1 rounded-xl bg-[#F5F5F7] px-1 py-1">
        <div className="pointer-events-none absolute inset-x-2 top-1/2 h-10 -translate-y-1/2 rounded-lg bg-white shadow-sm ring-1 ring-stone-200/70" />
        {!yearOnly && (
          <>
            <WheelColumn items={days} value={day} onChange={setDay} labelFor={(v) => String(v)} />
            <WheelColumn
              items={months}
              value={month}
              onChange={setMonth}
              labelFor={(v) => THAI_MONTHS[v]}
            />
          </>
        )}
        <WheelColumn
          items={years}
          value={year}
          onChange={setYear}
          labelFor={(v) => String(v + 543)}
        />
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={onClear}
          className="rounded-xl px-3 py-2 text-xs font-semibold text-stone-500 transition hover:bg-stone-100"
        >
          ล้างค่า
        </button>
        <button
          type="button"
          onClick={() => onConfirm(toYmd(year, yearOnly ? 0 : month, yearOnly ? 1 : day))}
          className="ml-auto flex-1 rounded-full bg-[#0071e3] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0071e3]/90 hover:text-white"
        >
          ยืนยัน
        </button>
      </div>
    </div>
  );
}

/** Legacy month-grid calendar kept for announcement date ranges */
function RangeCalendarPanel({
  rangeStart,
  rangeEnd,
  onChangeRange,
  onClose,
}: {
  rangeStart?: string;
  rangeEnd?: string;
  onChangeRange?: (start: string, end: string) => void;
  onClose: () => void;
}) {
  const seed = rangeStart ? new Date(rangeStart) : new Date();
  const [currentMonth, setCurrentMonth] = useState(isNaN(seed.getTime()) ? new Date().getMonth() : seed.getMonth());
  const [currentYear, setCurrentYear] = useState(isNaN(seed.getTime()) ? new Date().getFullYear() : seed.getFullYear());
  const [tempStart, setTempStart] = useState<string | null>(rangeStart || null);
  const [tempEnd, setTempEnd] = useState<string | null>(rangeEnd || null);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const daysCount = daysInMonth(currentYear, currentMonth);
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const cells: { day: number; month: number; year: number; isCurrentMonth: boolean }[] = [];
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const prevDays = daysInMonth(prevYear, prevMonth);
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    cells.push({ day: prevDays - i, month: prevMonth, year: prevYear, isCurrentMonth: false });
  }
  for (let i = 1; i <= daysCount; i++) {
    cells.push({ day: i, month: currentMonth, year: currentYear, isCurrentMonth: true });
  }
  const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
  const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
  while (cells.length < 42) {
    const day = cells.length - (firstDayIndex + daysCount) + 1;
    cells.push({ day, month: nextMonth, year: nextYear, isCurrentMonth: false });
  }

  const toStr = (day: number, month: number, year: number) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  return (
    <div className="w-64 select-none rounded-xl border border-stone-250 bg-white p-3 shadow-xl">
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            if (currentMonth === 0) {
              setCurrentMonth(11);
              setCurrentYear(currentYear - 1);
            } else setCurrentMonth(currentMonth - 1);
          }}
          className="rounded-lg p-1 text-stone-600 hover:bg-stone-100"
        >
          <ChevronLeft className="size-4" />
        </button>
        <div className="text-[12px] font-bold text-stone-800">
          {THAI_MONTHS[currentMonth]} {currentYear + 543}
        </div>
        <button
          type="button"
          onClick={() => {
            if (currentMonth === 11) {
              setCurrentMonth(0);
              setCurrentYear(currentYear + 1);
            } else setCurrentMonth(currentMonth + 1);
          }}
          className="rounded-lg p-1 text-stone-600 hover:bg-stone-100"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
      <div className="mb-1 grid grid-cols-7 gap-1 text-center">
        {THAI_WEEKDAYS.map((d, idx) => (
          <div
            key={d}
            className={`text-[10px] font-bold ${idx === 0 ? 'text-red-500' : idx === 6 ? 'text-blue-500' : 'text-stone-500'}`}
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, idx) => {
          const dateStr = toStr(cell.day, cell.month, cell.year);
          const selected = tempStart === dateStr || tempEnd === dateStr;
          const inRange =
            !!tempStart &&
            !!tempEnd &&
            dateStr > tempStart &&
            dateStr < tempEnd;
          return (
            <button
              key={`${dateStr}-${idx}`}
              type="button"
              onMouseEnter={() => {
                if (tempStart && !tempEnd) setHoveredDate(dateStr);
              }}
              onClick={() => {
                if (!tempStart || (tempStart && tempEnd)) {
                  setTempStart(dateStr);
                  setTempEnd(null);
                } else if (dateStr < tempStart) {
                  setTempStart(dateStr);
                } else {
                  setTempEnd(dateStr);
                  onChangeRange?.(tempStart, dateStr);
                  onClose();
                }
              }}
              className={`flex size-7 items-center justify-center text-[10px] font-medium transition ${
                !cell.isCurrentMonth
                  ? 'text-stone-300'
                  : selected
                    ? 'rounded-lg bg-emerald-600 text-white'
                    : inRange || (!!tempStart && !tempEnd && !!hoveredDate && dateStr > tempStart && dateStr < hoveredDate)
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'rounded-lg text-stone-700 hover:bg-stone-100'
              }`}
            >
              {cell.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

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
  buttonClassName = 'p-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-250 rounded-lg text-stone-600 transition flex items-center justify-center cursor-pointer',
  iconClassName = 'w-3.5 h-3.5',
  yearOnly = false,
}: ThaiDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [positionAbove, setPositionAbove] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    setPositionAbove(spaceBelow < 280 && spaceAbove > spaceBelow);
  }, [isOpen]);

  const display =
    mode === 'range'
      ? rangeStart && rangeEnd
        ? `${formatDisplayThaiDate(rangeStart)} – ${formatDisplayThaiDate(rangeEnd)}`
        : placeholder
      : value
        ? formatDisplayThaiDate(value, yearOnly)
        : placeholder;

  return (
    <div className={`relative inline-block text-left ${variant === 'input' ? 'w-full' : 'shrink-0'}`} ref={containerRef}>
      {variant === 'icon' ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={buttonClassName}
          title="เลือกวันที่"
        >
          <CalendarIcon className={iconClassName} />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-left text-sm transition hover:bg-stone-50 focus:border-emerald-500 focus:outline-none"
        >
          <span className={value || (rangeStart && rangeEnd) ? 'font-medium text-stone-800' : 'text-stone-400'}>
            {display}
          </span>
          <CalendarIcon className="size-4 text-stone-400" />
        </button>
      )}

      {isOpen && (
        <div
          className={`absolute z-50 ${align === 'right' ? 'right-0' : 'left-0'} ${
            positionAbove ? 'bottom-full mb-2' : 'top-full mt-2'
          }`}
        >
          {mode === 'range' ? (
            <RangeCalendarPanel
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              onChangeRange={onChangeRange}
              onClose={() => setIsOpen(false)}
            />
          ) : (
            <ScrollDatePanel
              value={value}
              yearOnly={yearOnly}
              onConfirm={(ymd) => {
                onChange?.(ymd);
                setIsOpen(false);
              }}
              onClear={() => {
                onChange?.('');
                setIsOpen(false);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
