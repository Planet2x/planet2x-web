import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Planet2x Creative Studio",
    template: "%s | Planet2x",
  },
  description:
    "A safe 0.x Next.js rebuild for the public Planet2x website, developed in parallel while the Framer site remains live.",
  metadataBase: new URL("https://planet2x.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={manrope.variable}>{children}</body>
    </html>
  );
}
