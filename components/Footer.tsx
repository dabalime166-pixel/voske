"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES, SITE } from "@/lib/constants";
import { LanguageSwitch, useI18n } from "./I18nProvider";

export function Footer() {
  const pathname = usePathname();
  const { t } = useI18n();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="mt-auto bg-[#111] text-[#f6f3ee]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-4 md:px-8">
        <div>
          <p className="font-serif text-4xl tracking-[0.2em]">VOSKE</p>
          <p className="mt-1 text-xs tracking-[0.28em] text-white/40">ՈՍԿԵ</p>
          <p className="mt-4 max-w-xs text-sm leading-7 text-white/70">{t("footer.blurb")}</p>
          <div className="mt-5">
            <LanguageSwitch />
          </div>
        </div>
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-white/40">{t("nav.catalog")}</p>
          <div className="flex flex-col gap-2 text-sm text-white/75">
            {CATEGORIES.map((cat) => (
              <Link key={cat.id} href={`/catalog?category=${cat.id}`} className="hover:text-white">
                {t(`cat.${cat.id}`)}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-white/40">{t("footer.house")}</p>
          <div className="flex flex-col gap-2 text-sm text-white/75">
            <Link href="/about">{t("footer.about")}</Link>
            <Link href="/gold">{t("footer.gold")}</Link>
            <Link href="/delivery">{t("footer.delivery")}</Link>
            <Link href="/contacts">{t("footer.contacts")}</Link>
            <Link href="/admin">{t("footer.admin")}</Link>
          </div>
        </div>
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-white/40">{t("footer.connect")}</p>
          <p className="text-sm leading-7 text-white/75">
            {t("footer.tg")}
            <br />
            <a className="text-[var(--gold-bright)]" href={SITE.telegramUrl} target="_blank" rel="noreferrer">
              @{SITE.telegram}
            </a>
          </p>
          <p className="mt-4 text-sm leading-7 text-white/75">
            {t("footer.track")}
            <br />
            <a className="text-[var(--gold-bright)]" href={`tel:${SITE.trackingPhone}`}>
              {SITE.trackingPhoneDisplay}
            </a>
          </p>
          <p className="mt-4 text-sm text-white/40">{t("footer.cities")}</p>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-[11px] text-white/35">
        {t("footer.copy", { year: new Date().getFullYear() })}
      </div>
    </footer>
  );
}
