import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope, Noto_Sans_Armenian } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { StoreProvider } from "@/components/StoreProvider";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

const notoHy = Noto_Sans_Armenian({
  variable: "--font-noto-hy",
  subsets: ["armenian"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "VOSKE — золотые украшения России и Армении",
    template: "%s · VOSKE",
  },
  description:
    "VOSKE / ՈՍԿԵ — ювелирный дом золотых украшений. Каталог, курс золота по кнопке, доставка по России и Армении. Поддержка Telegram @themoonberry.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${manrope.variable} ${cormorant.variable} ${notoHy.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-[var(--paper)] text-[var(--ink)]">
        <StoreProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
