"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { METALS } from "@/lib/constants";
import { discountPercent, formatRub } from "@/lib/format";
import { IconHeart } from "@/components/Icons";
import { ProductCard } from "@/components/ProductCard";
import { useStore } from "@/components/StoreProvider";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { products, addToCart, favorites, toggleFavorite } = useStore();
  const product = products.find((p) => p.slug === slug);
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const related = useMemo(
    () => products.filter((p) => product && p.id !== product.id && (p.category === product.category || p.collection === product.collection)).slice(0, 4),
    [products, product],
  );

  if (!product) {
    return <div className="px-8 py-24 text-center">Украшение не найдено или ещё загружается...</div>;
  }

  const sale = discountPercent(product.price, product.oldPrice);
  const metal = METALS.find((m) => m.id === product.metal)?.label;
  const loved = favorites.includes(product.id);
  const needsSize = product.sizes.length > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <p className="text-sm text-[var(--ink-soft)]">
        <Link href="/catalog">Каталог</Link> / {product.name}
      </p>
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden bg-[#efe6d4]">
          <Image src={product.images[0] || "/images/voske-logo.jpg"} alt={product.name} fill className="object-cover" priority />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-deep)]">
            {product.collection} · {product.origin === "armenia" ? "Армения" : "Россия"}
          </p>
          <h1 className="font-serif mt-2 text-4xl md:text-5xl">{product.name}</h1>
          <p className="mt-1 text-sm text-[var(--ink-soft)]">{product.nameHy}</p>
          <p className="mt-2 text-sm">в духе {product.inspiredBy} · арт. {product.article} · {product.sku}</p>
          <div className="mt-6 flex items-end gap-3">
            <span className="text-3xl">{formatRub(product.price)}</span>
            {product.oldPrice ? <span className="text-lg line-through opacity-50">{formatRub(product.oldPrice)}</span> : null}
            {sale > 0 && <span className="bg-[var(--gold)] px-2 py-1 text-xs">−{sale}%</span>}
          </div>
          <p className="mt-6 leading-8 text-[var(--ink-soft)]">{product.description}</p>

          <dl className="mt-8 grid grid-cols-2 gap-4 text-sm">
            <div><dt className="opacity-50">Металл</dt><dd>{metal}</dd></div>
            <div><dt className="opacity-50">Проба</dt><dd>{product.purity}</dd></div>
            <div><dt className="opacity-50">Вес</dt><dd>{product.weight} г</dd></div>
            <div><dt className="opacity-50">Вставки</dt><dd>{product.stones.join(", ") || "без камней"}</dd></div>
            <div><dt className="opacity-50">Гарантия</dt><dd>{product.warrantyMonths} мес.</dd></div>
            <div><dt className="opacity-50">Наличие</dt><dd>{product.inStock ? `${product.stockCount} шт.` : "нет в наличии"}</dd></div>
          </dl>

          {needsSize && (
            <div className="mt-8">
              <p className="mb-2 text-sm">Размер</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`h-10 min-w-10 border px-3 ${size === s ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--cream)]" : "border-[var(--line)]"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex border border-[var(--line)]">
              <button className="px-3 py-3" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span className="px-4 py-3">{qty}</span>
              <button className="px-3 py-3" onClick={() => setQty(qty + 1)}>+</button>
            </div>
            <button
              disabled={!product.inStock || (needsSize && !size)}
              onClick={() => addToCart({ productId: product.id, quantity: qty, size: size || undefined })}
              className="bg-[var(--ink)] px-8 py-3 text-sm uppercase tracking-[0.18em] text-[var(--cream)] disabled:opacity-40"
            >
              В корзину
            </button>
            <button onClick={() => toggleFavorite(product.id)} className="border border-[var(--line)] p-3" aria-label="Избранное">
              <IconHeart filled={loved} />
            </button>
          </div>
          {needsSize && !size && <p className="mt-2 text-sm text-[var(--pomegranate)]">Выберите размер</p>}

          <div className="mt-10 border-t border-[var(--line)] pt-6 text-sm leading-7">
            <p>Доставка по России и Армении. Самовывоз в Ереване и Москве.</p>
            <p>Возврат 14 дней при сохранности пломбы и бирки — как в SOKOLOV и SUNLIGHT.</p>
          </div>
        </div>
      </div>

      {product.reviews.length > 0 && (
        <section className="mt-16">
          <h2 className="font-serif text-3xl">Отзывы · {product.rating}</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {product.reviews.map((review) => (
              <blockquote key={review.author + review.date} className="panel rounded-2xl p-6">
                <p className="text-sm uppercase tracking-[0.16em]">{review.author} · {review.city}</p>
                <p className="mt-3 leading-7">{review.text}</p>
                <p className="mt-3 text-xs opacity-50">{review.date} · {review.rating}/5</p>
              </blockquote>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-serif text-3xl">Рядом на витрине</h2>
          <div className="mt-6 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
