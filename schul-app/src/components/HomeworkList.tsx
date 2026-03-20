"use client"
import { useState, useTransition } from "react"
import { toggleHomeworkStatus } from "@/actions/homework"
import { CheckCircle2, Circle, Clock, Tag } from "lucide-react"

export function HomeworkList({ items }: { items: any[] }) {
  if (!items || items.length === 0) {
    return (
      <div className="glass p-8 text-center text-foreground/50 border-dashed">
        Keine Hausaufgaben gefunden. Du hast alles erledigt! 🎉
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {items.map((hw) => (
        <HomeworkItem key={hw.id} item={hw} />
      ))}
    </div>
  )
}

function HomeworkItem({ item }: { item: any }) {
  const isInitiallyDone = item.statuses?.[0]?.status === true
  const [isDone, setIsDone] = useState(isInitiallyDone)
  const [isPending, startTransition] = useTransition()

  const handleToggle = () => {
    setIsDone(!isDone)
    startTransition(() => {
      toggleHomeworkStatus(item.id)
    })
  }

  const daysUntil = Math.ceil((new Date(item.dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
  const isUrgent = daysUntil <= 1 && !isDone

  return (
    <div className={`glass p-4 transition-all duration-300 ${isDone ? 'opacity-60 bg-foreground/5' : 'hover:scale-[1.01] hover:shadow-md'} ${isUrgent ? 'border-red-500/30 bg-red-500/5' : ''}`}>
      <div className="flex items-start gap-4">
        <button 
          onClick={handleToggle}
          disabled={isPending}
          className="mt-1 flex-shrink-0 text-primary hover:scale-110 transition-transform disabled:opacity-50"
        >
          {isDone ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6 opacity-30" />}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span 
              className="text-xs font-bold px-2.5 py-1 rounded-md"
              style={{ backgroundColor: `${item.subject?.color || '#4F46E5'}15`, color: item.subject?.color || '#4F46E5' }}
            >
              <Tag className="w-3 h-3 inline mr-1" />
              {item.subject?.name || "Fach"}
            </span>
            <span className={`text-xs flex items-center gap-1 ${isUrgent ? 'text-red-500 font-medium' : 'text-foreground/50'}`}>
              <Clock className="w-3 h-3" />
              {new Date(item.dueDate).toLocaleDateString("de-DE", { weekday: 'short', day: '2-digit', month: '2-digit' })}
            </span>
          </div>
          <p className={`text-sm md:text-base text-foreground/90 ${isDone ? 'line-through' : ''}`}>
            {item.description}
          </p>
        </div>
      </div>
    </div>
  )
}
