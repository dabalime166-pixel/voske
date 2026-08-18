"use client";

import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { useStore } from "@/components/StoreProvider";

export default function FavoritesPage() {
  const { favorites, products } = useStore();
  const list = products.filter((p) => favorites.includes(p.id));
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <h1 className="font-serif text-5xl">Избранное</h1>
      {list.length === 0 ? (
        <p className="mt-8">
          Пока пусто. Отметьте сердце на витрине.{" "}
          <Link href="/catalog" className="underline decoration-[var(--gold)]">
            В каталог
          </Link>
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {list.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
