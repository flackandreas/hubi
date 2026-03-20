"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getTimetableForUser() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { class: true }
  });

  if (!user?.classId) return [];

  const timetable = await prisma.timetable.findMany({
    where: { classId: user.classId },
    include: { subject: true },
    orderBy: [
      { dayOfWeek: "asc" },
      { period: "asc" }
    ]
  });

  return timetable;
}
