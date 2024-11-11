import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/NavbarSignedOut";
import SessionWrapper from "@/components/SessionWrapper";
import { getServerSession } from "next-auth";
import NavbarLogin from "@/components/NavbarLogedIn";
import ReCaptchaProvider from "@/components/ReCaptachaProvider";
// import Footer from "@/components/Footer";

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
  // viewport: "initial-scale=1, width=device-width", // Add it here
};

// Move viewport to a separate export
export const viewport = "initial-scale=1, width=device-width";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  // console.log("Server Session" + session);

  return (
    <html lang="en">
      <ReCaptchaProvider>
        <SessionWrapper>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <nav>{!!session && <NavbarLogin />}</nav>
            <nav>{!session && <Navbar />} </nav>
            {children}
            {/* <Footer /> */}
          </body>
        </SessionWrapper>
      </ReCaptchaProvider>
    </html>
  );
}
