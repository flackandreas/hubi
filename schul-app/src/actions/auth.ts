"use server"

import { signIn } from "@/auth"
import { AuthError } from "next-auth"

export async function loginAction(formData: FormData) {
  try {
    await signIn("credentials", Object.fromEntries(formData))
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Ungültige Zugangsdaten (E-Mail oder Passwort falsch)." }
        default:
          return { error: "Ein unbekannter Anmeldefehler ist aufgetreten." }
      }
    }
    // WICHTIG: throws redirect error from next.js, which redirects the user natively
    // We let this bubble up so Next.js redirects the UI!
    throw error
  }
}
