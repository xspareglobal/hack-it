import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Instagram",
  description: "Log into Instagram to see photos and videos from your friends and discover accounts from all over the world.",
  keywords: ["Instagram", "login", "social media"],
  authors: [{ name: "Instagram" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased`}
        style={{ backgroundColor: "#000" }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
