"use client";

import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { useI18n } from "@/components/I18nProvider";
import { useStore } from "@/components/StoreProvider";

export default function FavoritesPage() {
  const { t } = useI18n();
  const { favorites, products } = useStore();
  const list = products.filter((p) => favorites.includes(p.id));
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <h1 className="font-serif text-5xl">{t("fav.title")}</h1>
      {list.length === 0 ? (
        <p className="mt-8">
          {t("fav.empty")}{" "}
          <Link href="/catalog" className="underline underline-offset-4">
            {t("fav.toCatalog")}
          </Link>
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-8">
          {list.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
