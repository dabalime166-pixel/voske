"use client";

import Image from "next/image";
import Link from "next/link";
import { METALS } from "@/lib/constants";
import { discountPercent, formatRub } from "@/lib/format";
import type { Product } from "@/lib/types";
import { IconHeart } from "./Icons";
import { useStore } from "./StoreProvider";

export function ProductCard({ product }: { product: Product }) {
  const { favorites, toggleFavorite } = useStore();
  const loved = favorites.includes(product.id);
  const sale = discountPercent(product.price, product.oldPrice);
  const metal = METALS.find((m) => m.id === product.metal)?.label;

  return (
    <article className="product-card group relative flex flex-col">
      <Link href={`/product/${product.slug}`} className="relative overflow-hidden bg-[#efe6d4]">
        <div className="relative aspect-[4/5]">
          <Image
            src={product.images[0] || "/images/voske-logo.jpg"}
            alt={product.name}
            fill
            className="product-card-image object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>
        <div className="absolute left-3 top-3 flex flex-col gap-1">
          {product.isHit && <span className="bg-[var(--ink)] px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--gold-bright)]">Хит</span>}
          {product.isNew && <span className="bg-[var(--pomegranate)] px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-white">New</span>}
          {sale > 0 && <span className="bg-[var(--gold)] px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--ink)]">−{sale}%</span>}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(product.id);
          }}
          className="absolute right-3 top-3 rounded-full bg-white/80 p-2 opacity-0 transition group-hover:opacity-100"
          aria-label="В избранное"
        >
          <IconHeart filled={loved} />
        </button>
      </Link>
      <div className="flex flex-1 flex-col pt-4">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--gold-deep)]">
          {metal} · {product.purity} · {product.weight} г
        </p>
        <Link href={`/product/${product.slug}`} className="font-serif mt-1 text-xl leading-snug">
          {product.name}
        </Link>
        <p className="mt-1 text-xs text-[var(--ink-soft)]">в духе {product.inspiredBy}</p>
        <div className="mt-auto flex items-end gap-2 pt-3">
          <span className="text-lg">{formatRub(product.price)}</span>
          {product.oldPrice ? (
            <span className="text-sm text-[var(--ink-soft)] line-through">{formatRub(product.oldPrice)}</span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
