import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/NavbarSignedOut";
import SessionWrapper from "@/components/SessionWrapper";
import { getServerSession } from "next-auth";
import NavbarLogin from "@/components/NavbarLogedIn";
import ReCaptchaProvider from "@/components/ReCaptachaProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "My Resume App",
  description: "Your Online Resume",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  // console.log("Server Session" + session);

  return (
    <html lang="en">
      <SessionWrapper>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ReCaptchaProvider>
            <nav>{!!session && <NavbarLogin />}</nav>
            <nav>{!session && <Navbar />} </nav>
            {children}
          </ReCaptchaProvider>
        </body>
      </SessionWrapper>
    </html>
  );
}
