"use client";

import Image from "next/image";
import Link from "next/link";
import { formatRub } from "@/lib/format";
import { useStore } from "@/components/StoreProvider";

export default function CartPage() {
  const { cart, products, setQty, removeFromCart } = useStore();
  const lines = cart
    .map((item) => ({ item, product: products.find((p) => p.id === item.productId) }))
    .filter((line): line is { item: (typeof cart)[0]; product: NonNullable<(typeof products)[0]> } => Boolean(line.product));
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.item.quantity, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-8">
      <h1 className="font-serif text-5xl">Корзина</h1>
      {lines.length === 0 ? (
        <div className="py-16 text-center">
          <p>Пока пусто — как витрина до открытия.</p>
          <Link href="/catalog" className="mt-6 inline-block border border-[var(--ink)] px-6 py-3 text-sm uppercase tracking-[0.16em]">
            В каталог
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_280px]">
          <div className="flex flex-col gap-6">
            {lines.map(({ item, product }) => (
              <div key={product.id + (item.size || "")} className="flex gap-4 border-b border-[var(--line)] pb-6">
                <div className="relative h-28 w-24 overflow-hidden bg-[#efe6d4]">
                  <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <Link href={`/product/${product.slug}`} className="font-serif text-xl">
                    {product.name}
                  </Link>
                  <p className="text-sm opacity-60">
                    {product.purity} · {product.weight} г {item.size ? `· размер ${item.size}` : ""}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <button onClick={() => setQty(product.id, item.quantity - 1, item.size)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => setQty(product.id, item.quantity + 1, item.size)}>+</button>
                    <button className="ml-4 text-sm underline" onClick={() => removeFromCart(product.id, item.size)}>
                      Удалить
                    </button>
                  </div>
                </div>
                <div className="text-right">{formatRub(product.price * item.quantity)}</div>
              </div>
            ))}
          </div>
          <aside className="panel h-fit rounded-2xl p-6">
            <p className="flex justify-between">
              <span>Сумма</span>
              <span>{formatRub(subtotal)}</span>
            </p>
            <p className="mt-2 text-sm opacity-60">Доставка бесплатно от 25 000 ₽</p>
            <Link href="/checkout" className="mt-6 block bg-[var(--ink)] py-3 text-center text-sm uppercase tracking-[0.18em] text-[var(--cream)]">
              Оформить заказ
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
