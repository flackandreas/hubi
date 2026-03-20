import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function run() {
  console.log("Checking DB for admin@schule.de...")
  const user = await prisma.user.findUnique({ where: { email: 'admin@schule.de' } })
  console.log("User found:", user ? "YES" : "NO")
  
  if (user) {
    const isValid = await bcrypt.compare("password123", user.password);
    console.log("Password valid:", isValid)
  }
}

run()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
