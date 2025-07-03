"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { courseSchema, courseSchemaType } from "@/lib/zodSchema";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { isSpoofedBot } from "@arcjet/inspect";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";

const aj = arcjet
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [],
    })
  )
  .withRule(
    fixedWindow({
      mode: "LIVE",
      window: "1m",
      max: 5,
    })
  );

export async function EditCourse(
  data: courseSchemaType,
  courseId: string
): Promise<ApiResponse> {
  const session = await requireAdmin();

  const req = await request();

  const decision = await aj.protect(req, {
    fingerprint: session?.user.id as string,
  });

  if (decision.isDenied()) {
    // Bots not in the allow list will be blocked
    if (decision.reason.isBot()) {
      return {
        message: "You are a bot!",
        status: "error",
      };
    }

    if (decision.results.some(isSpoofedBot)) {
      return {
        message: "You are pretending to be a good bot!",
        status: "error",
      };
    }
  }

  try {
    const validation = courseSchema.safeParse(data);

    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid from Data",
      };
    }

    if (!session?.user?.id) {
      return {
        status: "error",
        message: "User session is invalid.",
      };
    }

    const { duration, ...restData } = validation.data;

    const course = await prisma.course.update({
      where: {
        id: courseId,
        userId: session?.user.id,
      },
      data: {
        ...restData,
        duration: duration,
      },
    });

    return {
      status: "success",
      message: "Course Updated Successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Course update failed",
    };
  }
}

export async function reorderLessons(
  chapterId: string,
  lessons: {
    id: string;
    position: string;
  }[],
  courseId: string
): Promise<ApiResponse> {
  const session = await requireAdmin();

  const req = await request();

  const decision = await aj.protect(req, {
    fingerprint: session?.user.id as string,
  });

  if (decision.isDenied()) {
    // Bots not in the allow list will be blocked
    if (decision.reason.isBot()) {
      return {
        message: "You are a bot!",
        status: "error",
      };
    }

    if (decision.results.some(isSpoofedBot)) {
      return {
        message: "You are pretending to be a good bot!",
        status: "error",
      };
    }
  }

  try {
    if (!lessons || lessons.length === 0) {
      return {
        status: "error",
        message: "No lessons provided",
      };
    }

    const updates = lessons.map((lesson) =>
      prisma.lesson.update({
        where: {
          id: lesson.id,
          chapterId: chapterId,
        },
        data: {
          position: lesson.position,
        },
      })
    );

    await prisma.$transaction(updates);

    revalidatePath(`/admin/courses/${courseId}/edit`);
    return {
      status: "success",
      message: "Lessons Updated Successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to reorder lessons",
    };
  }
}

export async function reorderChapters(
  chapters: {
    id: string;
    position: number;
  }[],
  courseId: string
): Promise<ApiResponse> {
  const session = await requireAdmin();

  const req = await request();

  const decision = await aj.protect(req, {
    fingerprint: session?.user.id as string,
  });

  if (decision.isDenied()) {
    // Bots not in the allow list will be blocked
    if (decision.reason.isBot()) {
      return {
        message: "You are a bot!",
        status: "error",
      };
    }

    if (decision.results.some(isSpoofedBot)) {
      return {
        message: "You are pretending to be a good bot!",
        status: "error",
      };
    }
  }

  try {
    if (!chapters || chapters.length === 0) {
      return {
        status: "error",
        message: "No chapters provided",
      };
    }

    const updates = chapters.map((chapter) =>
      prisma.chapter.update({
        where: {
          id: chapter.id,
          courseId: courseId,
        },
        data: {
          position: chapter.position,
        },
      })
    );

    await prisma.$transaction(updates);

    revalidatePath(`/admin/courses/${courseId}/edit`);
    return {
      status: "success",
      message: "Chapters Updated Successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to reorder Chapters",
    };
  }
}
