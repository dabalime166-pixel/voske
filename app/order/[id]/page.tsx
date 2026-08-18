"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/constants";
import { formatDateTime, formatRub } from "@/lib/format";
import type { Order } from "@/lib/types";

export default function OrderSuccessPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then(setOrder);
  }, [id]);

  if (!order?.number) {
    return <div className="px-8 py-24 text-center">Ищем заказ...</div>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold-deep)]">Заказ принят</p>
      <h1 className="font-serif mt-3 text-5xl">{order.number}</h1>
      <p className="mt-4 text-[var(--ink-soft)]">{formatDateTime(order.createdAt)}</p>
      <div className="panel mt-10 rounded-3xl p-8 text-left">
        <p className="leading-8">
          Спасибо, {order.customer.firstName}. Уведомление со всеми деталями уже в админке VOSKE. Для отслеживания заказа звоните:
        </p>
        <a href={`tel:${SITE.trackingPhone}`} className="font-serif mt-4 block text-4xl tracking-wide">
          {SITE.trackingPhoneDisplay}
        </a>
        <p className="mt-6 leading-8">
          Служба заботы — Telegram{" "}
          <a className="underline decoration-[var(--gold)]" href={SITE.telegramUrl} target="_blank" rel="noreferrer">
            @{SITE.telegram}
          </a>
        </p>
        <ul className="mt-6 space-y-2 text-sm">
          {order.items.map((item) => (
            <li key={item.productId + (item.size || "")} className="flex justify-between">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{formatRub(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex justify-between text-lg">
          <span>Итого</span>
          <span>{formatRub(order.total)}</span>
        </p>
      </div>
      <Link href="/catalog" className="mt-10 inline-block border border-[var(--ink)] px-6 py-3 text-sm uppercase tracking-[0.16em]">
        Вернуться в каталог
      </Link>
    </div>
  );
}
