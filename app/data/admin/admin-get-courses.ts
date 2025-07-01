import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function adminGetCourses() {
  await requireAdmin();

  const data = await prisma.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      smallDescription: true,
      description: true,
      level: true,
      status: true,
      slug: true,
      category: true,
      fileKey: true,
      price: true,
      duration: true,
    },
  });

  return data;
}

export type AdminGetCourseType = Awaited<ReturnType<typeof adminGetCourses>>[0];
