import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10)

  console.log('Clearing old data...')
  await prisma.homeworkStatus.deleteMany()
  await prisma.homework.deleteMany()
  await prisma.timetable.deleteMany()
  await prisma.user.deleteMany()
  await prisma.subject.deleteMany()
  await prisma.class.deleteMany()

  console.log('Creating Class 10A...')
  const class10A = await prisma.class.create({
    data: { name: '10A' },
  })

  console.log('Creating Subjects...')
  const math = await prisma.subject.create({
    data: { name: 'Mathematik', color: '#4F46E5' },
  })
  const english = await prisma.subject.create({
    data: { name: 'Englisch', color: '#E11D48' },
  })

  console.log('Creating Admin User...')
  await prisma.user.create({
    data: {
      email: 'admin@schule.de',
      name: 'Admin Lehrer',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log('Creating Student User...')
  await prisma.user.create({
    data: {
      email: 'schueler@schule.de',
      name: 'Max Mustermann',
      password: hashedPassword,
      role: 'STUDENT',
      classId: class10A.id,
    },
  })

  console.log('Creating Timetable for today...')
  let currentDay = new Date().getDay()
  if (currentDay < 1 || currentDay > 5) currentDay = 1 // Fallback to Monday if Weekend

  await prisma.timetable.create({
    data: {
      classId: class10A.id,
      subjectId: math.id,
      dayOfWeek: currentDay,
      period: 1,
      room: 'R101',
      teacherId: 'Herr Müller'
    }
  })
  await prisma.timetable.create({
    data: {
      classId: class10A.id,
      subjectId: english.id,
      dayOfWeek: currentDay,
      period: 2,
      room: 'R210',
      teacherId: 'Frau Schmidt'
    }
  })

  console.log('Creating Homework...')
  await prisma.homework.create({
    data: {
      classId: class10A.id,
      subjectId: english.id,
      description: 'Vokabeln Unit 4 (S. 112) lernen und ins Heft abschreiben.',
      dueDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000) // Tomorrow
    }
  })

  console.log('Seeding finished successfully! 🎉')
  console.log('Admin login: admin@schule.de / password123')
  console.log('Student login: schueler@schule.de / password123')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
