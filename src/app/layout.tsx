import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ixi_flower | Developer & Infrastructure Engineer",
  description:
    "Amirabbas Rouintan — Self-taught developer, backend & infra engineer. Python, TypeScript, DevOps, and cybersecurity.",
  keywords: [
    "ixi_flower",
    "Amirabbas Rouintan",
    "developer",
    "backend",
    "infrastructure",
    "Python",
    "TypeScript",
    "React",
    "DevOps",
  ],
  authors: [{ name: "Amirabbas Rouintan", url: "https://github.com/ixiflower" }],
  creator: "Amirabbas Rouintan",
  openGraph: {
    title: "ixi_flower | Developer & Infrastructure Engineer",
    description:
      "Self-taught developer since 2019. Building backend systems, cloud infrastructure, and crafting pixel-perfect frontends.",
    type: "website",
    locale: "en_US",
    siteName: "ixi_flower Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "ixi_flower | Developer & Infrastructure Engineer",
    description:
      "Self-taught developer since 2019. Building backend systems, cloud infrastructure, and crafting pixel-perfect frontends.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
