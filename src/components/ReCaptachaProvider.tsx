"use client";

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import React from "react";

interface ReCaptchaProviderProps {
  children: React.ReactNode;
}

const ReCaptchaProvider: React.FC<ReCaptchaProviderProps> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const clientKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={clientKey!}
      scriptProps={{ async: true, defer: true }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
};

export default ReCaptchaProvider;
