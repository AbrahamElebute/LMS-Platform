import { authClient } from "@/lib/auth-client";
import * as React from "react";

interface EmailTemplateProps {
  email: string;
  otp: string;
}

const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  email,
  otp,
}) => {
  return (
    <div>
      <span>hello 👋 {email}!</span>
      <p>
        You OTP is <strong>{otp}</strong>
      </p>
    </div>
  );
};

export default EmailTemplate;
