"use client";

import Image from "next/image";
import Link from "next/link";
import { CATEGORIES, SITE } from "@/lib/constants";
import { ProductCard } from "@/components/ProductCard";
import { useI18n } from "@/components/I18nProvider";
import { useStore } from "@/components/StoreProvider";

export default function HomePage() {
  const { t, formatPrice } = useI18n();
  const { products, loaded } = useStore();
  const hits = products.filter((p) => p.isHit).slice(0, 8);
  const armenian = products.filter((p) => p.origin === "armenia").slice(0, 4);
  const news = products.filter((p) => p.isNew).slice(0, 4);
  const minHit = loaded && hits.length ? formatPrice(Math.min(...hits.map((p) => p.price))) : formatPrice(9800);

  return (
    <div>
      <section className="relative min-h-[86vh] overflow-hidden">
        <Image src="/images/voske-hero.jpg" alt="VOSKE" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
        <div className="relative z-10 mx-auto flex min-h-[86vh] max-w-7xl flex-col justify-end px-4 pb-16 pt-28 md:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/70">{t("hero.kicker")}</p>
          <h1 className="font-serif mt-4 max-w-3xl text-5xl leading-[0.92] text-white md:text-7xl">{t("hero.title")}</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/75 md:text-lg">{t("hero.lead")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/catalog" className="btn btn-gold">
              {t("hero.shop")}
            </Link>
            <Link href="/gold" className="btn btn-ghost">
              {t("hero.gold")}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--ink-soft)]">{t("home.categories")}</p>
        <h2 className="font-serif mt-1 text-4xl">{t("home.vitrine")}</h2>
        <div className="mt-8 flex gap-2 overflow-x-auto pb-2 md:flex-wrap">
          {CATEGORIES.map((cat) => (
            <Link key={cat.id} href={`/catalog?category=${cat.id}`} className="chip shrink-0">
              {t(`cat.${cat.id}`)}
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--ink-soft)]">{t("home.hits")}</p>
              <h2 className="font-serif text-4xl">{t("home.hitsTitle")}</h2>
            </div>
            <Link href="/catalog?hit=1" className="text-sm font-medium underline underline-offset-4">
              {t("home.allHits")}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4 lg:gap-7">
            {(loaded ? hits : []).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-2">
        <div className="relative min-h-[420px]">
          <Image src="/images/voske-heritage.jpg" alt="" fill className="object-cover" />
        </div>
        <div className="flex flex-col justify-center bg-[#111] px-8 py-16 text-white md:px-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">{t("home.heritage")}</p>
          <h2 className="font-serif mt-3 text-5xl">{t("home.heritageTitle")}</h2>
          <p className="mt-5 max-w-md text-lg leading-8 text-white/70">{t("home.heritageLead")}</p>
          <Link href="/catalog?origin=armenia" className="btn btn-ghost mt-8 w-fit">
            {t("home.openCollection")}
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--ink-soft)]">{t("home.news")}</p>
        <h2 className="font-serif text-4xl">{t("home.newsTitle")}</h2>
        <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4 lg:gap-7">
          {(loaded ? (news.length ? news : products.slice(0, 4)) : []).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-16 md:grid-cols-3 md:px-8">
        {[
          ["home.feature1", "home.feature1d"],
          ["home.feature2", "home.feature2d"],
          ["home.feature3", "home.feature3d"],
        ].map(([title, body]) => (
          <div key={title} className="rounded-[28px] bg-white p-8">
            <h3 className="text-xl font-semibold">{t(title)}</h3>
            <p className="mt-3 leading-7 text-[var(--ink-soft)]">
              {t(body, { phone: SITE.trackingPhoneDisplay, telegram: SITE.telegram })}
            </p>
          </div>
        ))}
      </section>

      <section className="relative overflow-hidden">
        <Image src="/images/voske-salon.jpg" alt="" fill className="object-cover" />
        <div className="relative bg-black/50 px-4 py-24 text-center text-white">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/60">{t("home.invite")}</p>
          <h2 className="font-serif mx-auto mt-3 max-w-2xl text-4xl md:text-5xl">{t("home.inviteTitle")}</h2>
          <p className="mx-auto mt-5 max-w-lg text-white/75">{t("home.from", { price: minHit })}</p>
          <Link href="/contacts" className="btn btn-gold mt-8 inline-flex">
            {t("home.contact")}
          </Link>
        </div>
      </section>

      {armenian.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
          <h2 className="font-serif mb-8 text-4xl">{t("home.armenianAtelier")}</h2>
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4 lg:gap-7">
            {armenian.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
