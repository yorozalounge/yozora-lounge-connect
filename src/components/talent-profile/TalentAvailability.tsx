import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Static UTC availability by day-of-week (0=Sun, 1=Mon, ..., 6=Sat)
const weeklySlots: Record<number, number[]> = {
  0: [3, 7],          // Sunday
  1: [1, 5, 11],      // Monday
  2: [2, 6, 12],      // Tuesday
  3: [1, 5, 9],       // Wednesday
  4: [3, 7, 11],      // Thursday
  5: [1, 5, 10],      // Friday
  6: [2, 6, 11],      // Saturday
};

const getUserTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "UTC";
  }
};

const getUtcOffset = (tz: string): number => {
  const now = new Date();
  const utcStr = now.toLocaleString("en-US", { timeZone: "UTC" });
  const localStr = now.toLocaleString("en-US", { timeZone: tz });
  return (new Date(localStr).getTime() - new Date(utcStr).getTime()) / 3600000;
};

const formatHour = (h: number): string => {
  const normalized = ((h % 24) + 24) % 24;
  const period = normalized >= 12 ? "PM" : "AM";
  const display = normalized === 0 ? 12 : normalized > 12 ? normalized - 12 : normalized;
  return `${display}${period}`;
};

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const TalentAvailability = () => {
  const timezone = getUserTimezone();
  const offset = getUtcOffset(timezone);
  const today = new Date();

  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  }, [viewMonth, viewYear]);

  const getSlotsForDate = (day: number): string[] => {
    const date = new Date(viewYear, viewMonth, day);
    const dow = date.getDay();
    const utcHours = weeklySlots[dow] ?? [];
    return utcHours.map((h) => formatHour(h + offset));
  };

  const isToday = (day: number) =>
    day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  const isPast = (day: number) => {
    const date = new Date(viewYear, viewMonth, day);
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return date < todayStart;
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  const shortTz = timezone.replace(/_/g, " ").split("/").pop() || timezone;
  const selectedSlots = selectedDate ? getSlotsForDate(selectedDate) : [];

  return (
    <div className="border border-gold-subtle p-6">
      <h2 className="font-heading text-gold tracking-[0.15em] text-xl mb-2">Availability</h2>
      <p className="text-ivory-muted text-[11px] mb-5 opacity-60">
        Your timezone: <span className="text-gold">{shortTz}</span> (UTC{offset >= 0 ? "+" : ""}{offset})
      </p>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="text-ivory-muted hover:text-gold transition-colors p-1">
          <ChevronLeft size={16} />
        </button>
        <span className="font-heading text-ivory text-sm tracking-wider">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button onClick={nextMonth} className="text-ivory-muted hover:text-gold transition-colors p-1">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="text-center text-[10px] text-ivory-muted opacity-50 py-1">
            {label}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;
          const past = isPast(day);
          const hasSlots = !past && (weeklySlots[new Date(viewYear, viewMonth, day).getDay()] ?? []).length > 0;
          const selected = selectedDate === day;

          return (
            <button
              key={day}
              onClick={() => !past && hasSlots && setSelectedDate(selected ? null : day)}
              disabled={past || !hasSlots}
              className={`
                relative text-xs py-2 transition-all
                ${past ? "text-ivory-muted/30 cursor-default" : ""}
                ${!past && !hasSlots ? "text-ivory-muted/40 cursor-default" : ""}
                ${!past && hasSlots && !selected ? "text-ivory hover:bg-primary/10 cursor-pointer" : ""}
                ${selected ? "bg-primary/20 text-gold border border-gold-subtle" : "border border-transparent"}
                ${isToday(day) ? "font-bold" : ""}
              `}
            >
              {day}
              {hasSlots && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold/60" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day slots */}
      {selectedDate && (
        <div className="mt-5 pt-4 border-t border-gold-subtle">
          <p className="text-ivory text-xs mb-3 opacity-70">
            Available times for <span className="text-gold font-medium">{MONTH_NAMES[viewMonth]} {selectedDate}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedSlots.map((time) => (
              <div
                key={time}
                className="text-ivory text-xs py-1.5 px-3 border border-gold-subtle bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer"
              >
                {time}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TalentAvailability;
