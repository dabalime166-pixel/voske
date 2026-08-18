"use client";

import Image from "next/image";
import Link from "next/link";
import { CATEGORIES, SITE } from "@/lib/constants";
import { formatRub } from "@/lib/format";
import { Ornament } from "@/components/Icons";
import { ProductCard } from "@/components/ProductCard";
import { useStore } from "@/components/StoreProvider";

export default function HomePage() {
  const { products, loaded } = useStore();
  const hits = products.filter((p) => p.isHit).slice(0, 8);
  const armenian = products.filter((p) => p.origin === "armenia").slice(0, 4);
  const news = products.filter((p) => p.isNew).slice(0, 4);

  return (
    <div>
      <section className="relative min-h-[88vh] overflow-hidden">
        <Image src="/images/voske-hero.jpg" alt="VOSKE gold" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
        <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-end px-4 pb-20 pt-32 md:px-8">
          <p className="text-xs uppercase tracking-[0.42em] text-[var(--gold-bright)]">{SITE.nameHy} · GOLD HOUSE</p>
          <h1 className="font-serif mt-4 max-w-3xl text-5xl leading-[0.95] text-[var(--cream)] md:text-7xl">
            Золото, которое помнит Ереван и светит в Москве
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--cream)]/80">
            Дом VOSKE собрал эстетику лучших онлайн-витрин — 585*Золотой, SOKOLOV, МЮЗ, EFREMOV, NEWGOLD, SUNLIGHT — и армянскую филигрань в одном салоне.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/catalog" className="bg-[var(--gold)] px-8 py-3 text-sm uppercase tracking-[0.2em] text-[var(--ink)]">
              Смотреть витрину
            </Link>
            <Link href="/gold" className="border border-[var(--gold)] px-8 py-3 text-sm uppercase tracking-[0.2em] text-[var(--cream)]">
              Курс золота
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold-deep)]">Категории</p>
            <h2 className="font-serif text-4xl">Витрина дома</h2>
          </div>
          <Ornament className="hidden h-8 w-48 text-[var(--gold)] md:block" />
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-9">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalog?category=${cat.id}`}
              className="panel rounded-xl px-3 py-5 text-center transition hover:-translate-y-1"
            >
              <span className="font-serif block text-lg">{cat.label}</span>
              <span className="text-[10px] tracking-[0.16em] text-[var(--gold-deep)]">{cat.labelHy}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#efe6d4]/50 py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold-deep)]">Хиты</p>
              <h2 className="font-serif text-4xl">То, что разбирают первыми</h2>
            </div>
            <Link href="/catalog?hit=1" className="text-sm uppercase tracking-[0.16em] underline decoration-[var(--gold)]">
              Все хиты
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {(loaded ? hits : []).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-2">
        <div className="relative min-h-[420px]">
          <Image src="/images/voske-heritage.jpg" alt="Армянское наследие" fill className="object-cover" />
        </div>
        <div className="flex flex-col justify-center bg-[var(--ink)] px-8 py-16 text-[var(--cream)] md:px-16">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">Армянское наследие</p>
          <h2 className="font-serif mt-3 text-5xl">Нар, хачкар, Арарат</h2>
          <p className="mt-5 max-w-md text-lg leading-8 text-[var(--cream)]/75">
            Гранат как дом, крест как молитва, горы как память. Коллекция, которой нет у массовых российских сетей — и которая звучит по-родному в Ереване.
          </p>
          <Link href="/catalog?origin=armenia" className="mt-8 w-fit border border-[var(--gold)] px-6 py-3 text-sm uppercase tracking-[0.18em]">
            Открыть коллекцию
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold-deep)]">Новинки</p>
          <h2 className="font-serif text-4xl">Только с верстака</h2>
        </div>
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {(loaded ? news.length ? news : products.slice(0, 4) : []).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 md:grid-cols-3 md:px-8">
        {[
          { t: "Честный металл", d: "На карточке — проба, вес в граммах и цвет золота. Курс на отдельной странице не прыгает сам: только когда вы нажмёте «Обновить»." },
          { t: "Два мира", d: "Русские салоны научили нас фильтрам, примерке и хитам. Армянские дворы — филиграни, гранату и кресту. VOSKE держит оба языка." },
          { t: "Живой заказ", d: `После оплаты в админку приходит полное уведомление. Вам — номер ${SITE.trackingPhoneDisplay} и Telegram @${SITE.telegram}.` },
        ].map((item) => (
          <div key={item.t} className="panel rounded-2xl p-8">
            <h3 className="font-serif text-2xl">{item.t}</h3>
            <p className="mt-3 leading-7 text-[var(--ink-soft)]">{item.d}</p>
          </div>
        ))}
      </section>

      <section className="relative overflow-hidden">
        <Image src="/images/voske-salon.jpg" alt="Салон VOSKE" fill className="object-cover" />
        <div className="relative bg-black/55 px-4 py-24 text-center text-[var(--cream)]">
          <p className="text-xs uppercase tracking-[0.32em] text-[var(--gold-bright)]">Приглашение</p>
          <h2 className="font-serif mx-auto mt-3 max-w-2xl text-5xl">Примерьте золото, как в салоне на Северном проспекте и на Тверской</h2>
          <p className="mx-auto mt-5 max-w-lg opacity-80">
            Средний чек хитов — от {loaded && hits[0] ? formatRub(Math.min(...hits.map((p) => p.price))) : "9 800 ₽"}
          </p>
          <Link href="/contacts" className="mt-8 inline-block bg-[var(--gold)] px-8 py-3 text-sm uppercase tracking-[0.2em] text-[var(--ink)]">
            Связаться с домом
          </Link>
        </div>
      </section>

      {armenian.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <h2 className="font-serif mb-8 text-4xl">Из армянских мастерских</h2>
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {armenian.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
