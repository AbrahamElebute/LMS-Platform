import { auth } from "@/lib/auth";
import LoginForm from "./_components/LoginForm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session) {
    // If the user is already logged in, redirect to the home page
    return redirect("/");
  }
  return <LoginForm />;
}
