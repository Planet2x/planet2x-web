import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Planet2x",
    template: "%s | Planet2x",
  },
  description:
    "Planet2x web foundation for a calm, premium, content-led public website.",
  metadataBase: new URL("https://planet2x.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

