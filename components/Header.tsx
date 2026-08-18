"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CATEGORIES, SITE } from "@/lib/constants";
import { productName } from "@/lib/product-i18n";
import { IconBag, IconClose, IconHeart, IconMenu, IconSearch, IconTelegram } from "./Icons";
import { LanguageSwitch, useI18n } from "./I18nProvider";
import { useStore } from "./StoreProvider";

const NAV = [
  { href: "/catalog", key: "nav.catalog" },
  { href: "/gold", key: "nav.gold" },
  { href: "/about", key: "nav.about" },
  { href: "/delivery", key: "nav.delivery" },
  { href: "/contacts", key: "nav.contacts" },
] as const;

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, locale, formatPrice } = useI18n();
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
        [productName(p, locale), p.name, p.nameHy, p.nameEn, p.sku, p.inspiredBy]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q),
      )
      .slice(0, 6);
  }, [products, query, locale]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50">
      <div className="hidden items-center justify-between bg-[#111] px-6 py-2 text-[11px] text-white/70 md:flex">
        <p>Yerevan · Moscow · RU / ՀԱ / EN</p>
        <div className="flex items-center gap-5">
          <Link href="/gold" className="hover:text-white">
            {t("top.goldHint")}
          </Link>
          <a href={SITE.telegramUrl} className="inline-flex items-center gap-1 hover:text-white" target="_blank" rel="noreferrer">
            <IconTelegram /> @{SITE.telegram}
          </a>
          <a href={`tel:${SITE.trackingPhone}`} className="hover:text-white">
            {t("top.tracking")} {SITE.trackingPhoneDisplay}
          </a>
        </div>
      </div>
      <div className="border-b border-[var(--line)] bg-[var(--glass)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
          <button className="rounded-full p-2 hover:bg-black/5 md:hidden" onClick={() => setOpen(true)} aria-label={t("nav.menu")}>
            <IconMenu />
          </button>
          <Link href="/" className="flex items-center gap-3">
            <Image src="/images/voske-logo.jpg" alt="VOSKE" width={40} height={40} className="rounded-full" />
            <span className="leading-none">
              <span className="font-serif block text-2xl tracking-[0.22em] md:text-[1.7rem]">VOSKE</span>
              <span className="block text-[9px] tracking-[0.32em] text-[var(--ink-soft)]">ՈՍԿԵ</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-[13px] font-medium md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={pathname === item.href ? "text-[#111]" : "text-[var(--ink-soft)] hover:text-[#111]"}
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <LanguageSwitch />
            </div>
            <button onClick={() => setSearchOpen(true)} aria-label={t("nav.search")} className="rounded-full p-2 hover:bg-black/5">
              <IconSearch />
            </button>
            <Link href="/favorites" className="relative rounded-full p-2 hover:bg-black/5" aria-label={t("nav.favorites")}>
              <IconHeart filled={favorites.length > 0} />
              {favorites.length > 0 && (
                <span className="absolute right-0 top-0 h-4 min-w-4 rounded-full bg-[var(--pomegranate)] px-1 text-[10px] leading-4 text-white">
                  {favorites.length}
                </span>
              )}
            </Link>
            <Link href="/cart" className="relative rounded-full p-2 hover:bg-black/5" aria-label={t("nav.cart")}>
              <IconBag />
              {count > 0 && (
                <span className="absolute right-0 top-0 h-4 min-w-4 rounded-full bg-[#111] px-1 text-[10px] leading-4 text-white">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
        <div className="mx-auto hidden max-w-7xl gap-2 overflow-x-auto px-8 pb-3 md:flex">
          {CATEGORIES.map((cat) => (
            <Link key={cat.id} href={`/catalog?category=${cat.id}`} className="chip whitespace-nowrap">
              {t(`cat.${cat.id}`)}
            </Link>
          ))}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] bg-black/50 md:hidden" onClick={() => setOpen(false)}>
          <div className="h-full w-[82%] max-w-sm bg-[#111] p-6 text-white" onClick={(e) => e.stopPropagation()}>
            <div className="mb-8 flex items-center justify-between">
              <span className="font-serif text-2xl tracking-[0.24em]">VOSKE</span>
              <button onClick={() => setOpen(false)}>
                <IconClose />
              </button>
            </div>
            <LanguageSwitch />
            <div className="mt-8 flex flex-col gap-4 text-lg">
              {NAV.map((item) => (
                <Link key={item.href} href={item.href}>
                  {t(item.key)}
                </Link>
              ))}
              {CATEGORIES.map((cat) => (
                <Link key={cat.id} href={`/catalog?category=${cat.id}`} className="text-sm text-white/55">
                  {t(`cat.${cat.id}`)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {searchOpen && (
        <div className="fixed inset-0 z-[70] bg-black/40 p-4" onClick={() => setSearchOpen(false)}>
          <div className="panel mx-auto mt-20 max-w-xl rounded-3xl p-6" onClick={(e) => e.stopPropagation()}>
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("search.placeholder")}
              className="w-full border-b border-[var(--line)] bg-transparent py-3 text-lg outline-none"
            />
            <div className="mt-4 flex flex-col">
              {results.map((product) => (
                <button
                  key={product.id}
                  className="flex items-center justify-between py-3 text-left hover:opacity-60"
                  onClick={() => router.push(`/product/${product.slug}`)}
                >
                  <span>{productName(product, locale)}</span>
                  <span className="text-sm">{formatPrice(product.price)}</span>
                </button>
              ))}
              {query.length >= 2 && results.length === 0 && <p className="py-6 text-sm opacity-60">{t("search.empty")}</p>}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
