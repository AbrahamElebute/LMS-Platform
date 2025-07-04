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

export async function CreateCourse(
  data: courseSchemaType
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

    const course = await prisma.course.create({
      data: {
        ...validation.data,
        userId: session?.user.id as string,
        duration: Number(validation.data.duration),
      },
    });

    return {
      status: "success",
      message: "Course Created Successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Course Creation failed",
    };
  }
}
