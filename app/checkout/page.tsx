"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SITE } from "@/lib/constants";
import { formatRub } from "@/lib/format";
import { useStore } from "@/components/StoreProvider";

const empty = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  country: "russia" as "russia" | "armenia",
  city: "",
  address: "",
  comment: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, products, clearCart } = useStore();
  const [customer, setCustomer] = useState(empty);
  const [deliveryMethod, setDeliveryMethod] = useState<"courier" | "pickup" | "cdek">("courier");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card" | "transfer">("cod");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const lines = cart
    .map((item) => ({ item, product: products.find((p) => p.id === item.productId) }))
    .filter((line) => line.product);
  const subtotal = lines.reduce((sum, line) => sum + (line.product?.price || 0) * line.item.quantity, 0);
  const deliveryPrice = deliveryMethod === "pickup" ? 0 : subtotal >= 25000 ? 0 : 790;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart, customer, deliveryMethod, paymentMethod }),
    });
    const data = await res.json();
    setPending(false);
    if (!res.ok) {
      setError(data.error || "Не удалось оформить заказ");
      return;
    }
    clearCart();
    router.push(`/order/${data.id}`);
  }

  if (!cart.length) {
    return <div className="px-8 py-24 text-center">Сначала положите украшение в корзину.</div>;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-8">
      <h1 className="font-serif text-5xl">Оформление</h1>
      <p className="mt-3 max-w-2xl text-[var(--ink-soft)]">
        После заказа в админку VOSKE придёт уведомление со всеми данными. Вам — телефон отслеживания {SITE.trackingPhoneDisplay} и Telegram @{SITE.telegram}.
      </p>
      <form onSubmit={submit} className="mt-10 grid gap-10 lg:grid-cols-[1fr_300px]">
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              ["firstName", "Имя"],
              ["lastName", "Фамилия"],
              ["phone", "Телефон"],
              ["email", "Email"],
              ["city", "Город"],
              ["address", "Адрес"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex flex-col gap-1 text-sm">
              {label}
              <input
                required
                className="border border-[var(--line)] bg-transparent px-3 py-2"
                value={customer[key]}
                onChange={(e) => setCustomer({ ...customer, [key]: e.target.value })}
              />
            </label>
          ))}
          <label className="flex flex-col gap-1 text-sm">
            Страна
            <select
              className="border border-[var(--line)] bg-transparent px-3 py-2"
              value={customer.country}
              onChange={(e) => setCustomer({ ...customer, country: e.target.value as "russia" | "armenia" })}
            >
              <option value="russia">Россия</option>
              <option value="armenia">Армения</option>
            </select>
          </label>
          <label className="sm:col-span-2 flex flex-col gap-1 text-sm">
            Комментарий
            <textarea
              className="min-h-24 border border-[var(--line)] bg-transparent px-3 py-2"
              value={customer.comment}
              onChange={(e) => setCustomer({ ...customer, comment: e.target.value })}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Доставка
            <select className="border border-[var(--line)] bg-transparent px-3 py-2" value={deliveryMethod} onChange={(e) => setDeliveryMethod(e.target.value as typeof deliveryMethod)}>
              <option value="courier">Курьер</option>
              <option value="cdek">СДЭК / почта РА</option>
              <option value="pickup">Самовывоз</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Оплата
            <select className="border border-[var(--line)] bg-transparent px-3 py-2" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as typeof paymentMethod)}>
              <option value="cod">При получении</option>
              <option value="card">Карта</option>
              <option value="transfer">Перевод</option>
            </select>
          </label>
        </div>
        <aside className="panel h-fit rounded-2xl p-6">
          <p className="font-serif text-2xl">Итого</p>
          <p className="mt-4 flex justify-between text-sm">
            <span>Товары</span>
            <span>{formatRub(subtotal)}</span>
          </p>
          <p className="mt-2 flex justify-between text-sm">
            <span>Доставка</span>
            <span>{deliveryPrice ? formatRub(deliveryPrice) : "бесплатно"}</span>
          </p>
          <p className="mt-4 flex justify-between text-lg">
            <span>К оплате</span>
            <span>{formatRub(subtotal + deliveryPrice)}</span>
          </p>
          {error && <p className="mt-3 text-sm text-[var(--pomegranate)]">{error}</p>}
          <button disabled={pending} className="mt-6 w-full bg-[var(--ink)] py-3 text-sm uppercase tracking-[0.18em] text-[var(--cream)]">
            {pending ? "Отправляем..." : "Подтвердить заказ"}
          </button>
        </aside>
      </form>
    </div>
  );
}
