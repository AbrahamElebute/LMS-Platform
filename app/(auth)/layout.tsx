import { buttonVariants } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center">
      <Link
        href="/"
        className={buttonVariants({
          variant: "outline",
          className: "absolute left-4 top-4",
        })}
      >
        <ArrowLeftIcon size={4} />
        Back
      </Link>
      <main className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center self-center gap-">
          <Image src={"/LMS logo.png"} alt="Logo" width={32} height={32} />
          <span className="font-medium">LMS Platform.</span>
        </Link>
        {children}

        <div className="text-balance text-center text-xs text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <span className="hover:text-primary hover:underline">
            Terms of service
          </span>{" "}
          and{" "}
          <span className="hover:text-primary hover:underline">
            Privacy Policy
          </span>
          .
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
