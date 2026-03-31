import { useMemo } from "react";

// Use day numbers instead of names
const days = [
  { num: 1, label: "1" },
  { num: 2, label: "2" },
  { num: 3, label: "3" },
  { num: 4, label: "4" },
  { num: 5, label: "5" },
  { num: 6, label: "6" },
  { num: 7, label: "7" },
];

// Static UTC availability — in production this comes from the DB
const slotsUTC: Record<number, number[]> = {
  1: [1, 5, 11],
  2: [2, 6, 12],
  3: [1, 5, 9],
  4: [3, 7, 11],
  5: [1, 5, 10],
  6: [2, 6, 11],
  7: [3, 7],
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
  return `${display}:00 ${period}`;
};

const TalentAvailability = () => {
  const timezone = getUserTimezone();
  const offset = getUtcOffset(timezone);

  const localSlots = useMemo(() => {
    const result: Record<number, string[]> = {};
    for (const day of days) {
      const utcHours = slotsUTC[day.num] ?? [];
      result[day.num] = utcHours.map((h) => formatHour(h + offset));
    }
    return result;
  }, [offset]);

  const shortTz = timezone.replace(/_/g, " ").split("/").pop() || timezone;

  return (
    <div className="border border-gold-subtle p-8">
      <h2 className="font-heading text-gold tracking-[0.15em] text-xl mb-6">Availability</h2>
      <p className="text-ivory-muted text-xs mb-6 opacity-70">
        Times shown in your timezone: <span className="text-gold">{shortTz}</span> (UTC{offset >= 0 ? "+" : ""}{offset})
      </p>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => (
          <div key={day.num} className="text-center">
            <span className="small-caps-gold text-[10px] block mb-3">{day.label}</span>
            <div className="space-y-2">
              {(localSlots[day.num] ?? []).map((time) => (
                <div
                  key={time}
                  className="text-ivory text-xs py-1.5 px-1 border border-gold-subtle bg-primary/5 hover:bg-primary/10 transition-colors"
                >
                  {time}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TalentAvailability;
