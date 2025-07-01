import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeftIcon, ShieldXIcon } from "lucide-react";

const NotAdminRoute = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="bg-destructive/10 rounded-full p-4 w-fit mx-auto">
            <ShieldXIcon className="size-16 text-destructive" />
          </div>

          <CardTitle className="text-2xl mt-4">Access Restricted</CardTitle>

          <CardDescription className="max-w-xs mx-auto mt-2 text-muted-foreground">
            You do not have the necessary permissions to access this page.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex justify-center mt-4">
          <Link
            href="/"
            className={buttonVariants({
              className: "w-full",
            })}
          >
            <ArrowLeftIcon className="mr-2 size-4" />
            Back to Home
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotAdminRoute;
