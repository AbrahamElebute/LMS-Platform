import React from "react";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { env } from "./env";
import { emailOTP } from "better-auth/plugins";
import { resend } from "@/app/api/send/route";
import EmailTemplate from "@/components/shared/email-template";
import { authClient } from "./auth-client";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        // Implement the sendVerificationOTP method to send the OTP to the user's email address
        const { data, error } = await resend.emails.send({
          from: "Fimi <onboarding@resend.dev>",
          to: [email],
          subject: "LMS Platform - Verify your email",
          react: React.createElement(EmailTemplate, {
            email: email,
            otp: otp,
          }),
        });
      },
    }),
  ],
});
