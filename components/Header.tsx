"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CATEGORIES, SITE } from "@/lib/constants";
import { formatRub } from "@/lib/format";
import { IconBag, IconClose, IconHeart, IconMenu, IconSearch, IconTelegram } from "./Icons";
import { useStore } from "./StoreProvider";

const NAV = [
  { href: "/catalog", label: "Каталог" },
  { href: "/gold", label: "Курс золота" },
  { href: "/about", label: "О доме" },
  { href: "/delivery", label: "Доставка" },
  { href: "/contacts", label: "Контакты" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { cart, favorites, products } = useStore();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return products
      .filter((p) =>
        [p.name, p.nameHy, p.sku, p.inspiredBy, p.collection, p.stones.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(q),
      )
      .slice(0, 6);
  }, [products, query]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50">
      <div className="dark-panel grain flex items-center justify-between gap-4 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-[var(--gold-bright)] md:px-8">
        <p className="hidden sm:block">Россия · Армения · {SITE.taglineHy}</p>
        <div className="flex flex-1 items-center justify-end gap-5">
          <Link href="/gold" className="hover:text-white">
            Курс золота — только по кнопке
          </Link>
          <a href={SITE.telegramUrl} className="inline-flex items-center gap-1 hover:text-white" target="_blank" rel="noreferrer">
            <IconTelegram /> @{SITE.telegram}
          </a>
          <a href={`tel:${SITE.trackingPhone}`} className="hover:text-white">
            Отслеживание {SITE.trackingPhoneDisplay}
          </a>
        </div>
      </div>
      <div className="border-b border-[var(--line)] bg-[var(--paper)]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
          <button className="md:hidden" onClick={() => setOpen(true)} aria-label="Меню">
            <IconMenu />
          </button>
          <Link href="/" className="flex items-center gap-3">
            <Image src="/images/voske-logo.jpg" alt="VOSKE" width={46} height={46} className="rounded-full border border-[var(--gold)]" />
            <span className="leading-none">
              <span className="font-serif block text-3xl tracking-[0.28em]">{SITE.name}</span>
              <span className="block text-[10px] tracking-[0.38em] text-[var(--gold-deep)]">{SITE.nameHy} GOLD HOUSE</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm tracking-[0.16em] uppercase md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={pathname === item.href ? "text-[var(--gold-deep)]" : "hover:text-[var(--gold-deep)]"}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={() => setSearchOpen(true)} aria-label="Поиск" className="rounded-full p-2 hover:bg-black/5">
              <IconSearch />
            </button>
            <Link href="/favorites" className="relative rounded-full p-2 hover:bg-black/5" aria-label="Избранное">
              <IconHeart filled={favorites.length > 0} />
              {favorites.length > 0 && (
                <span className="absolute right-0 top-0 h-4 min-w-4 rounded-full bg-[var(--pomegranate)] px-1 text-[10px] leading-4 text-white">
                  {favorites.length}
                </span>
              )}
            </Link>
            <Link href="/cart" className="relative rounded-full p-2 hover:bg-black/5" aria-label="Корзина">
              <IconBag />
              {count > 0 && (
                <span className="absolute right-0 top-0 h-4 min-w-4 rounded-full bg-[var(--ink)] px-1 text-[10px] leading-4 text-[var(--cream)]">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
        <div className="mx-auto hidden max-w-7xl gap-4 overflow-x-auto px-8 pb-3 text-xs uppercase tracking-[0.18em] text-[var(--ink-soft)] md:flex">
          {CATEGORIES.map((cat) => (
            <Link key={cat.id} href={`/catalog?category=${cat.id}`} className="whitespace-nowrap hover:text-[var(--gold-deep)]">
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] bg-[var(--ink)]/70 md:hidden" onClick={() => setOpen(false)}>
          <div className="dark-panel h-full w-80 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-8 flex items-center justify-between">
              <span className="font-serif text-2xl tracking-[0.3em]">VOSKE</span>
              <button onClick={() => setOpen(false)}>
                <IconClose />
              </button>
            </div>
            <div className="flex flex-col gap-4 text-lg">
              {NAV.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
              {CATEGORIES.map((cat) => (
                <Link key={cat.id} href={`/catalog?category=${cat.id}`} className="text-sm text-[var(--gold-bright)]">
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {searchOpen && (
        <div className="fixed inset-0 z-[70] bg-[var(--ink)]/50 p-4" onClick={() => setSearchOpen(false)}>
          <div className="panel mx-auto mt-24 max-w-xl rounded-2xl p-5" onClick={(e) => e.stopPropagation()}>
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск: кольцо, гранат, Арарат, 585..."
              className="w-full border-b border-[var(--line)] bg-transparent py-3 text-lg outline-none"
            />
            <div className="mt-4 flex flex-col">
              {results.map((product) => (
                <button
                  key={product.id}
                  className="flex items-center justify-between py-3 text-left hover:text-[var(--gold-deep)]"
                  onClick={() => router.push(`/product/${product.slug}`)}
                >
                  <span>{product.name}</span>
                  <span className="text-sm">{formatRub(product.price)}</span>
                </button>
              ))}
              {query.length >= 2 && results.length === 0 && <p className="py-6 text-sm opacity-60">Ничего не найдено</p>}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
