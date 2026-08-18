"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES, SITE } from "@/lib/constants";
import { Ornament } from "./Icons";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="dark-panel grain mt-auto">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-4 md:px-8">
        <div>
          <p className="font-serif text-4xl tracking-[0.28em]">VOSKE</p>
          <p className="mt-1 text-xs tracking-[0.4em] text-[var(--gold-bright)]">{SITE.nameHy}</p>
          <p className="mt-4 max-w-xs text-sm leading-7 text-[var(--cream)]/80">
            Ювелирный дом золотых украшений для России и Армении. Проба, вес и честная цена металла — как в лучших салонах, только в одном месте.
          </p>
          <Ornament className="mt-6 h-6 w-40 text-[var(--gold)]" />
        </div>
        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.22em] text-[var(--gold)]">Каталог</p>
          <div className="flex flex-col gap-2 text-sm text-[var(--cream)]/80">
            {CATEGORIES.map((cat) => (
              <Link key={cat.id} href={`/catalog?category=${cat.id}`} className="hover:text-white">
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.22em] text-[var(--gold)]">Дом</p>
          <div className="flex flex-col gap-2 text-sm text-[var(--cream)]/80">
            <Link href="/about">О VOSKE</Link>
            <Link href="/gold">Курс золота</Link>
            <Link href="/delivery">Доставка и возврат</Link>
            <Link href="/contacts">Контакты и поддержка</Link>
            <Link href="/admin">Администрирование</Link>
          </div>
        </div>
        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.22em] text-[var(--gold)]">Связь</p>
          <p className="text-sm leading-7 text-[var(--cream)]/80">
            Поддержка в Telegram
            <br />
            <a className="text-[var(--gold-bright)]" href={SITE.telegramUrl} target="_blank" rel="noreferrer">
              @{SITE.telegram}
            </a>
          </p>
          <p className="mt-4 text-sm leading-7 text-[var(--cream)]/80">
            Отслеживание заказа
            <br />
            <a className="text-[var(--gold-bright)]" href={`tel:${SITE.trackingPhone}`}>
              {SITE.trackingPhoneDisplay}
            </a>
          </p>
          <p className="mt-4 text-sm text-[var(--cream)]/60">Ереван · Москва · доставка по РФ и РА</p>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-[11px] uppercase tracking-[0.2em] text-[var(--cream)]/45">
        © {new Date().getFullYear()} VOSKE · золотые украшения · демо-ассортимент в эстетике 585, SOKOLOV, МЮЗ и армянских домов
      </div>
    </footer>
  );
}
