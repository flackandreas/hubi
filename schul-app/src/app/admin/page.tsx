import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { createHomework } from "@/actions/homework"
import { prisma } from "@/lib/prisma"
import { LayoutDashboard, PlusCircle, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default async function AdminPage({ searchParams }: { searchParams: { success?: string } }) {
  const session = await auth()
  
  // Fallback check
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/")
  }

  // Lade Stammdaten für die Formular-Select-Boxen
  const [classes, subjects] = await Promise.all([
    prisma.class.findMany(),
    prisma.subject.findMany()
  ])

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 pb-24">
      <header className="flex justify-between items-center mb-8 glass-panel p-4 px-6 mt-2 max-w-5xl mx-auto border-t-4 border-t-red-500">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-red-500">Admin Panel</h1>
          <p className="text-sm text-foreground/60">Hausaufgaben & Meldungen pushen</p>
        </div>
        <div className="flex gap-4 items-center">
           <Link href="/" title="Zum Dashboard" className="p-2 text-foreground/40 hover:text-foreground hover:bg-foreground/5 rounded-xl transition-colors">
             <LayoutDashboard className="w-5 h-5" />
           </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto animate-slide-up">
        {searchParams.success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-4 rounded-xl flex items-center gap-3 text-sm mb-6 animate-fade-in font-medium">
             <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
             <p>Hausaufgabe wurde erfolgreich an die Schüler gepushed!</p>
          </div>
        )}

        <div className="glass-panel p-6 md:p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <PlusCircle className="text-primary w-6 h-6" /> Neue Hausaufgabe eintragen
          </h2>
          
          <form action={async (formData) => {
             "use server"
             const classId = formData.get("classId") as string
             const subjectId = formData.get("subjectId") as string
             const description = formData.get("description") as string
             const dueDateStr = formData.get("dueDate") as string
             
             if (classId && subjectId && description && dueDateStr) {
                await createHomework({
                   classId,
                   subjectId,
                   description,
                   dueDate: new Date(dueDateStr)
                })
             }
             redirect("/admin?success=1")
          }} className="flex flex-col gap-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                 <label className="text-xs font-bold uppercase tracking-widest text-foreground/50 ml-1">Klasse</label>
                 <select name="classId" required className="w-full bg-background/50 border border-border rounded-xl py-3.5 px-4 outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer">
                    <option value="">Auswählen...</option>
                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                 </select>
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-bold uppercase tracking-widest text-foreground/50 ml-1">Fach</label>
                 <select name="subjectId" required className="w-full bg-background/50 border border-border rounded-xl py-3.5 px-4 outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer">
                    <option value="">Auswählen...</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                 </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-foreground/50 ml-1">Fällig am (Datum)</label>
              <input type="date" name="dueDate" required className="w-full bg-background/50 border border-border rounded-xl py-3.5 px-4 outline-none focus:ring-2 focus:ring-primary font-sans" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-foreground/50 ml-1">Aufgabenbeschreibung</label>
              <textarea name="description" rows={4} required className="w-full bg-background/50 border border-border rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary placeholder:text-foreground/30 resize-none leading-relaxed" placeholder="Bitte löst im Arbeitsheft Seite 12 die Nummern 3 und 4..." />
            </div>

            <button type="submit" className="mt-2 w-full py-4 text-[15px] font-bold rounded-xl text-primary-foreground bg-primary hover:bg-primary/95 transition-all shadow-lg shadow-primary/25 relative overflow-hidden group">
              <span className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_2s_infinite] skew-x-12" />
              Senden & Pushen
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
