import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { auth } from "@/lib/auth";
import { env } from "@/lib/env";
import { S3 } from "@/lib/S3Client";
import { isSpoofedBot } from "@arcjet/inspect";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

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

export async function DELETE(request: Request) {
  const session = await requireAdmin();

  const decision = await aj.protect(request, {
    fingerprint: session?.user.id as string,
  });

  if (decision.isDenied()) {
    // Bots not in the allow list will be blocked
    if (decision.reason.isBot()) {
      return NextResponse.json(
        {
          error: "You are a bot!",
          denied: decision.reason.denied,
        },
        { status: 429 }
      );
    }

    if (decision.results.some(isSpoofedBot)) {
      return NextResponse.json(
        { error: "You are pretending to be a good bot!" },
        { status: 429 }
      );
    }

    return NextResponse.json({
      message: "Hello world",
    });
  }

  try {
    const body = await request.json();
    const key = body.key;
    if (!key) {
      return NextResponse.json(
        { error: "Missing or invalid object key" },
        { status: 400 }
      );
    }

    const command = new DeleteObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_IMAGES,
      Key: key,
    });

    await S3.send(command);

    return NextResponse.json(
      { message: "File deleted Successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Missing or invalid object key" },
      { status: 500 }
    );
  }
}
