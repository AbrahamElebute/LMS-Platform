"use client";
import ThemeToggle from "@/components/themeToggle";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Home() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const signOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          toast.success("Signed out successfully");
        },
        onError: (error) => {
          toast.error(error.error.message || "Failed to sign out");
        },
      },
    });
  };

  return (
    <h1>
      hey <ThemeToggle />
      {isPending ? (
        <p>Loading...</p>
      ) : session ? (
        <div>
          <p>{session.user.name}</p>
          <Button onClick={signOut}>LogOut</Button>
        </div>
      ) : (
        <Button
          onClick={() => {
            router.push("/login");
          }}
        >
          LogIn
        </Button>
      )}
    </h1>
  );
}
