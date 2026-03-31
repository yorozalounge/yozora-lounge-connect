const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Static availability display — in a real scenario this would come from the DB
const slots: Record<string, string[]> = {
  Mon: ["10:00", "14:00", "20:00"],
  Tue: ["11:00", "15:00", "21:00"],
  Wed: ["10:00", "14:00", "18:00"],
  Thu: ["12:00", "16:00", "20:00"],
  Fri: ["10:00", "14:00", "19:00"],
  Sat: ["11:00", "15:00", "20:00"],
  Sun: ["12:00", "16:00"],
};

const TalentAvailability = () => (
  <div className="border border-gold-subtle p-8">
    <h2 className="font-heading text-gold tracking-[0.15em] text-xl mb-6">Availability</h2>
    <p className="text-ivory-muted text-xs mb-6 opacity-70">All times shown in JST (UTC+9)</p>
    <div className="grid grid-cols-7 gap-2">
      {days.map((day) => (
        <div key={day} className="text-center">
          <span className="small-caps-gold text-[10px] block mb-3">{day}</span>
          <div className="space-y-2">
            {(slots[day] ?? []).map((time) => (
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

export default TalentAvailability;
