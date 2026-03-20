import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getHomeworkForUser } from "@/actions/homework"
import { getTimetableForUser } from "@/actions/timetable"
import { User, LogOut } from "lucide-react"
import { HomeworkList } from "@/components/HomeworkList"
import { TimetableCard } from "@/components/TimetableCard"
import { signOut } from "@/auth"

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  const [homework, timetable] = await Promise.all([
    getHomeworkForUser(),
    getTimetableForUser()
  ])

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 pb-24">
      <header className="flex justify-between items-center mb-8 glass-panel p-4 px-6 mt-2 max-w-5xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hallo {session.user.name?.split(" ")[0]}! 👋</h1>
          <p className="text-sm text-foreground/60">Hier ist dein Tagesüberblick</p>
        </div>
        <div className="flex gap-4 items-center">
           <form action={async () => {
             "use server";
             await signOut();
           }}>
             <button title="Abmelden" className="p-2 text-foreground/40 hover:text-foreground hover:bg-foreground/5 rounded-xl transition-colors">
               <LogOut className="w-5 h-5" />
             </button>
           </form>
           <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <User className="w-5 h-5" />
           </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-slide-up max-w-5xl mx-auto">
        {/* Homework Section (7 cols) */}
        <section className="lg:col-span-7 space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 px-1">
             📚 Anstehende Aufgaben
          </h2>
          <HomeworkList items={homework} />
        </section>

        {/* Timetable Section (5 cols) */}
        <section className="lg:col-span-5 space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 px-1">
             🕒 Dein Stundenplan
          </h2>
          <TimetableCard items={timetable} />
        </section>
      </main>
    </div>
  )
}
