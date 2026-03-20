import { MapPin, User, Clock } from "lucide-react"

export function TimetableCard({ items }: { items: any[] }) {
  if (!items || items.length === 0) {
    return (
      <div className="glass p-8 text-center text-foreground/50 border-dashed">
        Dein Stundenplan ist noch leer.
      </div>
    )
  }

  // Group by day of week (1 = Monday, etc)
  const weekdays = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"]
  
  // Minimal logic for today: Get current day 1-5, if weekend, default to Monday
  let currentDayInt = new Date().getDay()
  if (currentDayInt < 1 || currentDayInt > 5) currentDayInt = 1

  // Filter items for today to keep dashboard clean
  const todayItems = items.filter(i => i.dayOfWeek === currentDayInt)

  if (todayItems.length === 0) {
     return (
       <div className="glass p-6 text-center text-foreground/50">
         Heute ({weekdays[currentDayInt - 1]}) hast du keinen Unterricht! 🎉
       </div>
     )
  }

  return (
    <div className="glass overflow-hidden">
      <div className="bg-foreground/5 p-4 border-b border-border/50">
        <h3 className="font-medium flex items-center gap-2">
          📅 {weekdays[currentDayInt - 1]}
        </h3>
      </div>
      <div className="divide-y divide-border/30">
        {todayItems.map((period) => (
          <div key={period.id} className="p-4 flex gap-4 hover:bg-foreground/5 transition-colors">
             <div className="flex flex-col items-center justify-center w-12 flex-shrink-0 text-center">
               <span className="text-xl font-black text-primary/80">{period.period}.</span>
             </div>
             <div>
                <p className="font-bold text-lg leading-tight" style={{ color: period.subject?.color || 'var(--foreground)' }}>
                  {period.subject?.name || "Fach"}
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-foreground/60">
                   {period.room && (
                     <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {period.room}</span>
                   )}
                   {period.teacherId && (
                     <span className="flex items-center gap-1"><User className="w-3 h-3" /> {period.teacherId}</span>
                   )}
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  )
}
