import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Intelliwave — Chatbots sur mesure",
  description:
    "Intelliwave conçoit des chatbots personnalisés et élégants pour sublimer l'expérience client.",
  keywords: [
    "chatbot",
    "IA",
    "n8n",
    "automatisation",
    "agence",
    "Intelliwave",
  ],
  openGraph: {
    title: "Intelliwave — Chatbots sur mesure",
    description:
      "Des assistants IA minimalistes, puissants et alignés sur votre identité.",
    url: "https://agentic-33da317c.vercel.app",
    siteName: "Intelliwave",
    locale: "fr_FR",
    type: "website",
  },
  metadataBase: new URL("https://agentic-33da317c.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
