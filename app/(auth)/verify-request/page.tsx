"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { LoaderCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function verifyRequest() {
  const [otp, setOtp] = useState("");
  const [verifyPending, StartVerifyTransition] = useTransition();
  const param = useSearchParams();
  const email = param.get("email") as string;
  const router = useRouter();
  const isOtpCompleted = otp.length === 6;

  function verifyOtp() {
    StartVerifyTransition(async () => {
      await authClient.signIn.emailOtp({
        email: email,
        otp: otp,
        fetchOptions: {
          onSuccess: (response) => {
            toast.success("Email Verified");
            router.push("/");
          },
          onError: (error) => {
            toast.error(error.error.message || "Error verifying email");
          },
        },
      });
    });
  }
  return (
    <Card className="w-full mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Please check your email</CardTitle>
        <CardDescription>
          We have sent a Verification email code to your email address. Please
          open your email and paste code below
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <InputOTP
            value={otp}
            onChange={(value) => setOtp(value)}
            maxLength={6}
            className="gap-2"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code sent to your email
          </p>
        </div>
        <Button
          disabled={verifyPending || !isOtpCompleted}
          onClick={verifyOtp}
          className="w-full"
        >
          {verifyPending ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              <span>Verifying...</span>
            </>
          ) : (
            <span>Verify Account</span>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
