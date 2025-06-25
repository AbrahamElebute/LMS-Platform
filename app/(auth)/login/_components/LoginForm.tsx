"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { GithubIcon, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

const LoginForm = () => {
  const [githubPending, StartGithubTransition] = useTransition();
  const [emailPending, StartEmailTransition] = useTransition();
  const [email, setEmail] = useState<string>("");
  const router = useRouter();

  async function handleGithubSingUp() {
    StartGithubTransition(async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: (response) => {
            toast.success(
              "Signed in with GitHub, you will be redirected shortly..."
            );
          },
          onError: (error) => {
            toast.error(error.error.message || "Failed to sign in with GitHub");
          },
        },
      });
    });
  }

  async function handleEmailSingUp() {
    StartEmailTransition(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email: email,
        type: "sign-in",
        fetchOptions: {
          onSuccess: () => {
            toast.success("email sent");
            router.push(`/verify-request?email=${email}`);
          },
          onError: () => {
            toast.error("error sending Email");
          },
        },
      });
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Welcome back!</CardTitle>
        <CardDescription>
          Login with your Github or Email Account
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button
          onClick={handleGithubSingUp}
          disabled={githubPending}
          className="w-full"
          variant={"outline"}
        >
          {githubPending ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              <span>Loading...</span>
            </>
          ) : (
            <>
              <GithubIcon className="size-4" />
              <span>Sign in with Github</span>
            </>
          )}
        </Button>

        <div className="relative text-center text-sm after:absolute after:inset-0 after:-z-0 after:top-1/2 after:border-t after:border-border after:flex after:items-center">
          <span className="relative z-10 bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>

        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <Button
            onClick={handleEmailSingUp}
            disabled={emailPending || !email}
            type="button"
          >
            {emailPending ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <span>Continue With Email</span>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
