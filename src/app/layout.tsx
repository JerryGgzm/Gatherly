import type { Metadata, Viewport } from "next";
import { DM_Sans, Fredoka } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { BottomNav, TopNav } from "@/components/ui/Nav";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gatherly.pub — Six strangers. One table. One night.",
  description: "Meet people you wouldn't have met otherwise. Curated six-person dinners in Seattle.",
};

export const viewport: Viewport = {
  themeColor: "#FFF7E8",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fredoka.variable} ${dmSans.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-cream text-ink">
        <Providers>
          <TopNav />
          <main className="flex flex-1 flex-col pb-28 lg:pb-0">{children}</main>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
