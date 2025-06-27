"use client";

import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useSignOut = () => {
  const router = useRouter();

  return async () => {
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
};
