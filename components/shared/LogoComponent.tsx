import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/assets/LMS logo.png";

interface LogoComponentProps {
  className?: string;
}

const LogoComponent = ({ className }: LogoComponentProps) => {
  return (
    <Link
      href="/"
      className={`flex items-center  overflow-hidden ${className}`}
      aria-label="LMS Platform Home"
      title="LMS Platform"
    >
      <Image
        src={Logo}
        alt="LMS Platform Logo"
        className="!size-6 min-w-6 min-h-6 shrink-0"
        priority
      />
      <span className="font-semibold whitespace-nowrap overflow-hidden transition-all duration-200 ease-in-out w-auto group-data-[collapsible=icon]:w-8">
        LMS PLATFORM.
      </span>
    </Link>
  );
};

export default LogoComponent;
