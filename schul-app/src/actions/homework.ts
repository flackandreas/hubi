"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getHomeworkForUser() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user?.classId) return [];

  const homework = await prisma.homework.findMany({
    where: { classId: user.classId },
    include: { 
      subject: true,
      statuses: {
        where: { userId: user.id }
      }
    },
    orderBy: { dueDate: "asc" }
  });

  return homework;
}

export async function toggleHomeworkStatus(homeworkId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const existingStatus = await prisma.homeworkStatus.findFirst({
    where: {
      userId: session.user.id,
      homeworkId
    }
  });

  if (existingStatus) {
    await prisma.homeworkStatus.update({
      where: { id: existingStatus.id },
      data: { status: !existingStatus.status }
    });
  } else {
    await prisma.homeworkStatus.create({
      data: {
        userId: session.user.id,
        homeworkId,
        status: true
      }
    });
  }
}

export async function createHomework(data: { classId: string, subjectId: string, description: string, dueDate: Date }) {
  const session = await auth();
  // Casting to any to allow reading custom token.role mapping
  if (!session?.user || (session.user as any).role !== "ADMIN") {
     throw new Error("Unauthorized");
  }

  const homework = await prisma.homework.create({
    data: {
      classId: data.classId,
      subjectId: data.subjectId,
      description: data.description,
      dueDate: data.dueDate
    }
  });

  // To-Do: Push Notification API Call
  return homework;
}
