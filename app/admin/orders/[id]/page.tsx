"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/constants";
import { formatDateTime, formatRub } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/types";

const STATUSES: { id: OrderStatus; label: string }[] = [
  { id: "new", label: "Новый" },
  { id: "confirmed", label: "Подтверждён" },
  { id: "processing", label: "В работе" },
  { id: "shipped", label: "Отправлен" },
  { id: "completed", label: "Выполнен" },
  { id: "cancelled", label: "Отменён" },
];

export default function AdminOrderPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  async function load() {
    const res = await fetch(`/api/orders/${id}`);
    const data = await res.json();
    setOrder(data);
    if (data?.id && !data.read) {
      await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  async function setStatus(status: OrderStatus) {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setOrder(await res.json());
  }

  if (!order?.customer) return <p>Открываем уведомление...</p>;

  return (
    <div className="max-w-3xl">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold)]">Уведомление о покупке</p>
      <h1 className="font-serif text-4xl">{order.number}</h1>
      <p className="mt-2 text-white/60">{formatDateTime(order.createdAt)}</p>

      <section className="mt-8 border border-white/10 p-6">
        <h2 className="text-xs uppercase tracking-[0.18em] text-[var(--gold)]">Покупатель</h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          <div><dt className="text-white/40">Имя</dt><dd>{order.customer.firstName} {order.customer.lastName}</dd></div>
          <div><dt className="text-white/40">Телефон</dt><dd>{order.customer.phone}</dd></div>
          <div><dt className="text-white/40">Email</dt><dd>{order.customer.email}</dd></div>
          <div><dt className="text-white/40">Страна</dt><dd>{order.customer.country === "armenia" ? "Армения" : "Россия"}</dd></div>
          <div><dt className="text-white/40">Город</dt><dd>{order.customer.city}</dd></div>
          <div className="sm:col-span-2"><dt className="text-white/40">Адрес</dt><dd>{order.customer.address}</dd></div>
          <div className="sm:col-span-2"><dt className="text-white/40">Комментарий</dt><dd>{order.customer.comment || "—"}</dd></div>
        </dl>
      </section>

      <section className="mt-6 border border-white/10 p-6">
        <h2 className="text-xs uppercase tracking-[0.18em] text-[var(--gold)]">Состав</h2>
        <ul className="mt-4 space-y-3">
          {order.items.map((item) => (
            <li key={item.productId + (item.size || "")} className="flex justify-between gap-4">
              <span>
                {item.name} · {item.sku} {item.size ? `· ${item.size}` : ""} × {item.quantity}
              </span>
              <span>{formatRub(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex justify-between text-lg">
          <span>Итого</span>
          <span>{formatRub(order.total)}</span>
        </p>
        <p className="mt-2 text-sm text-white/50">
          Доставка: {order.deliveryMethod} · оплата: {order.paymentMethod} · отслеживание для гостя: {SITE.trackingPhoneDisplay}
        </p>
      </section>

      <label className="mt-6 block text-sm">
        Статус
        <select
          className="mt-2 w-full border border-white/20 bg-transparent px-3 py-2"
          value={order.status}
          onChange={(e) => setStatus(e.target.value as OrderStatus)}
        >
          {STATUSES.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
      </label>
    </div>
  );
}
