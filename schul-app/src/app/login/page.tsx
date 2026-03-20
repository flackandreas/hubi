"use client"
import { useState } from "react"
import { ArrowRight, BookOpen, Key, Mail, ShieldAlert } from "lucide-react"
import { loginAction } from "@/actions/auth"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    setError("")
    
    try {
      const res = await loginAction(formData)
      if (res?.error) {
        setError(res.error)
        setLoading(false)
      }
    } catch (err) {
      // WICHTIG: NextAuth wirft einen Next.js Redirect-Error für eine erfolgreiche Weiterleitung!
      console.log("Erfolgreich, leite weiter...")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-15%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/20 blur-[120px] animate-fade-in mix-blend-screen" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/15 blur-[120px] animate-fade-in sm:mix-blend-screen" />
      
      <div className="w-full max-w-md p-6 z-10 animate-slide-up">
        {/* Glassmorphism Card */}
        <div className="glass-panel p-8 md:p-10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col gap-8">
            <div className="flex flex-col items-center text-center gap-3 mb-2">
              <div className="h-20 w-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-2 shadow-inner ring-1 ring-white/10 relative overflow-hidden">
                 <div className="absolute inset-0 bg-primary/20 blur-xl"></div>
                <BookOpen className="w-9 h-9 text-primary relative z-10" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-glow">Schul-App</h1>
              <p className="text-sm font-medium text-foreground/50">Der smarte Weg für deinen Schultag</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-3 text-sm animate-fade-in">
                 <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                 <p>{error}</p>
              </div>
            )}

            <form action={handleSubmit} className="flex flex-col gap-5">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-foreground/50 ml-1">Email</label>
                <div className="relative group/input">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40 group-focus-within/input:text-primary transition-colors" />
                  <input 
                    name="email"
                    type="email" 
                    className="w-full bg-background/40 hover:bg-background/60 border border-border rounded-xl py-3.5 pl-11 pr-4 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 placeholder:text-foreground/30 font-medium text-[15px]"
                    placeholder="schueler@schule.de"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-foreground/50">Passwort</label>
                </div>
                <div className="relative group/input">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40 group-focus-within/input:text-primary transition-colors" />
                  <input 
                    name="password"
                    type="password" 
                    className="w-full bg-background/40 hover:bg-background/60 border border-border rounded-xl py-3.5 pl-11 pr-4 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 placeholder:text-foreground/30 font-medium text-[15px]"
                    placeholder="••••••••"
                    required
                  />
                </div>
                {/* Redirect-Target für NextAuth als hidden Field (falls AuthJS das benötigt, ansonsten fallback) */}
                <input type="hidden" name="redirectTo" value="/" />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="group relative mt-4 w-full flex justify-center py-4 px-4 border border-transparent text-[15px] font-bold rounded-xl text-primary-foreground bg-primary hover:bg-primary/95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden shadow-lg shadow-primary/25"
              >
                <span className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_2s_infinite] skew-x-12" />
                <span className="relative flex items-center gap-2">
                  {loading ? 'Wird authentifiziert...' : 'Anmelden'} 
                  {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
