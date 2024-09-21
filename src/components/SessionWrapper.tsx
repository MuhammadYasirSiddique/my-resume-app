"use client";

import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";

// Define the type for props
interface Props {
  children: ReactNode;
}

function SessionWrapper({ children }: Props) {
  return <SessionProvider>{children}</SessionProvider>;
}

export default SessionWrapper;
