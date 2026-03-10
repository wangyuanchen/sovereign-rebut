import type { Metadata } from "next";
import { playfair, jetbrains, notoSerifSC } from "@/lib/fonts";
import { Web3Provider } from "@/providers/web3-provider";
import { I18nProvider } from "@/lib/i18n";
import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "RebutAI | 永远不再哑口无言",
  description: "AI-powered comeback generator. Never be speechless again.",
  keywords: ["AI", "comeback", "response generator", "Chinese", "回怼", "Web3"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="dark" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${jetbrains.variable} ${notoSerifSC.variable} font-body antialiased min-h-screen bg-background text-text`}
      >
        <I18nProvider>
          <Web3Provider>
            <Navbar />
            <main>{children}</main>
            <Toaster />
          </Web3Provider>
        </I18nProvider>
      </body>
    </html>
  );
}
