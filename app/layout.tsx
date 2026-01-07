import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chromify - Transform Images into Perfect Color Palettes",
  description: "Upload any image and instantly generate beautiful, accessible color schemes with WCAG-compliant contrast ratios. Export to JSON, CSS, Tailwind, or PNG.",
  keywords: ["color palette", "color scheme", "design tool", "accessibility", "WCAG", "color extraction"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
