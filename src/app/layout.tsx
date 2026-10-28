import type { Metadata } from "next";
import { IBM_Plex_Mono, Noto_Sans_JP } from "next/font/google";
import IdleSessionGuard from "@/components/ui/IdleSessionGuard";
import QuitToTopButton from "@/components/ui/QuitToTopButton";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "700"],
  display: "swap",
  variable: "--font-mono",
});

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
  variable: "--font-sans-jp",
});

export const metadata: Metadata = {
  title: "FUTURE SIMULATOR — MINATO",
  description: "Life design transmission system 2026 ⇄ 2076",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={`${ibmPlexMono.variable} ${notoSansJP.variable}`}>
      <body>
        {children}
        <IdleSessionGuard />
        <QuitToTopButton />
      </body>
    </html>
  );
}
