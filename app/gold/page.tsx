"use client";

import { useEffect, useMemo, useState } from "react";
import { formatAmd, formatDateTime, formatNumber, formatRub, formatUsd } from "@/lib/format";
import type { GoldSnapshot } from "@/lib/types";

export default function GoldPage() {
  const [gold, setGold] = useState<GoldSnapshot | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [weight, setWeight] = useState("5");
  const [purity, setPurity] = useState<"999" | "750" | "585" | "375">("585");

  async function loadStored() {
    const res = await fetch("/api/gold", { cache: "no-store" });
    const data = await res.json();
    setGold(data.gold);
  }

  useEffect(() => {
    loadStored();
  }, []);

  async function refresh() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/gold/refresh", { method: "POST" });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Не удалось обновить курс");
      return;
    }
    setGold(data);
  }

  const calc = useMemo(() => {
    if (!gold) return null;
    const grams = Number(weight.replace(",", ".")) || 0;
    const gram = gold.perGram[purity];
    return {
      rub: gram.rub * grams,
      amd: gram.amd * grams,
      usd: gram.usd * grams,
    };
  }, [gold, weight, purity]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
      <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold-deep)]">Металл</p>
      <h1 className="font-serif text-5xl">Курс золота</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--ink-soft)]">
        Страница не обновляется сама. Цифры замирают до тех пор, пока вы не нажмёте кнопку — как котировка в кабинете пробирного надзора, а не тикер брокера.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          onClick={refresh}
          disabled={loading}
          className="bg-[var(--ink)] px-8 py-3 text-sm uppercase tracking-[0.2em] text-[var(--cream)] disabled:opacity-50"
        >
          {loading ? "Запрашиваем рынок..." : "Обновить курс"}
        </button>
        {gold ? (
          <p className="text-sm text-[var(--ink-soft)]">
            Последнее обновление: {formatDateTime(gold.updatedAt)} · {gold.source}
          </p>
        ) : (
          <p className="text-sm text-[var(--ink-soft)]">Курса ещё нет — нажмите «Обновить курс».</p>
        )}
      </div>
      {error && <p className="mt-3 text-[var(--pomegranate)]">{error}</p>}

      {gold && (
        <>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <div className="dark-panel rounded-2xl p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold)]">XAU / USD</p>
              <p className="font-serif mt-2 text-4xl">{formatUsd(gold.xauUsdPerOz)}</p>
              <p className="mt-2 text-sm opacity-70">за тройскую унцию</p>
            </div>
            <div className="panel rounded-2xl p-6">
              <p className="text-xs uppercase tracking-[0.2em]">USD / RUB</p>
              <p className="font-serif mt-2 text-4xl">{formatNumber(gold.usdRub, 2)}</p>
            </div>
            <div className="panel rounded-2xl p-6">
              <p className="text-xs uppercase tracking-[0.2em]">USD / AMD</p>
              <p className="font-serif mt-2 text-4xl">{formatNumber(gold.usdAmd, 2)}</p>
            </div>
          </div>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left">
              <thead className="text-xs uppercase tracking-[0.16em] text-[var(--gold-deep)]">
                <tr>
                  <th className="py-3">Проба</th>
                  <th>₽ / грамм</th>
                  <th>֏ / грамм</th>
                  <th>$ / грамм</th>
                </tr>
              </thead>
              <tbody>
                {(["999", "750", "585", "375"] as const).map((key) => (
                  <tr key={key} className="border-t border-[var(--line)]">
                    <td className="py-4 font-serif text-2xl">{key}</td>
                    <td>{formatRub(gold.perGram[key].rub)}</td>
                    <td>{formatAmd(gold.perGram[key].amd)}</td>
                    <td>{formatUsd(gold.perGram[key].usd, 2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <section className="panel mt-12 rounded-3xl p-8">
            <h2 className="font-serif text-3xl">Калькулятор лома и металла</h2>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">
              Считаем только спот металла. Ювелирная цена VOSKE выше: работа, закрепка, камни, пробирный надзор.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <label className="text-sm">
                Вес, г
                <input
                  className="mt-1 w-full border border-[var(--line)] bg-transparent px-3 py-2"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </label>
              <label className="text-sm">
                Проба
                <select
                  className="mt-1 w-full border border-[var(--line)] bg-transparent px-3 py-2"
                  value={purity}
                  onChange={(e) => setPurity(e.target.value as typeof purity)}
                >
                  <option value="999">999</option>
                  <option value="750">750</option>
                  <option value="585">585</option>
                  <option value="375">375</option>
                </select>
              </label>
              {calc && (
                <div>
                  <p className="text-sm opacity-60">Стоимость металла</p>
                  <p className="font-serif text-3xl">{formatRub(calc.rub)}</p>
                  <p className="text-sm">{formatAmd(calc.amd)} · {formatUsd(calc.usd)}</p>
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
