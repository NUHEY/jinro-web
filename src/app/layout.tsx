import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP, Zen_Kaku_Gothic_New } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

// 見出し用フォント。Apple風のすっきりしたデザインに合わせ、明朝体ではなく
// はっきりとした太さのゴシック体を採用する。
const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["700", "900"],
});

export const metadata: Metadata = {
  title: "人狼DX オンライン",
  description: "会話型心理ゲーム「人狼DX 新装版」のオンライン進行アプリ。集まったメンバーでスマホ片手に遊べます。",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0e1a" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      className={`${notoSansJP.variable} ${zenKakuGothicNew.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <TooltipProvider delayDuration={200}>
            {children}
            <Toaster richColors position="top-center" />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
