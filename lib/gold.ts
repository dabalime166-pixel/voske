import type { GoldSnapshot } from "./types";

const TROY_OUNCE_GRAMS = 31.1034768;
const PURITIES = [999, 750, 585, 375] as const;

async function fetchJson(url: string, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { cache: "no-store", signal: controller.signal });
    if (!res.ok) throw new Error(`${url} ${res.status}`);
    return res.json();
  } finally {
    clearTimeout(timer);
  }
}

async function fetchXauUsd() {
  try {
    const data = await fetchJson("https://api.gold-api.com/price/XAU");
    if (typeof data?.price === "number") return { price: data.price, source: "gold-api.com" };
  } catch {
    /* try next */
  }
  try {
    const data = await fetchJson("https://api.gold-api.com/price/XAU");
    if (typeof data?.price === "number") return { price: data.price, source: "gold-api.com" };
  } catch {
    /* try next */
  }
  throw new Error("Не удалось получить спот золота");
}

async function fetchFx() {
  try {
    const data = await fetchJson("https://open.er-api.com/v6/latest/USD");
    const usdRub = data?.rates?.RUB;
    const usdAmd = data?.rates?.AMD;
    if (typeof usdRub === "number" && typeof usdAmd === "number") {
      return { usdRub, usdAmd, source: "open.er-api.com" };
    }
  } catch {
    /* try next */
  }
  const cbr = await fetchJson("https://www.cbr-xml-daily.ru/daily_json.js");
  const usdRub = cbr?.Valute?.USD?.Value;
  const amdPerRub = cbr?.Valute?.AMD?.Value;
  if (typeof usdRub !== "number") throw new Error("Не удалось получить курсы валют");
  const usdAmd = typeof amdPerRub === "number" && amdPerRub > 0 ? usdRub / (amdPerRub / 100) : usdRub * 4.8;
  return { usdRub, usdAmd, source: "cbr-xml-daily.ru" };
}

export async function fetchLiveGold(): Promise<GoldSnapshot> {
  const [gold, fx] = await Promise.all([fetchXauUsd(), fetchFx()]);
  const usdPerGram999 = gold.price / TROY_OUNCE_GRAMS;
  const perGram = Object.fromEntries(
    PURITIES.map((purity) => {
      const factor = purity / 999;
      const usd = usdPerGram999 * factor;
      return [
        String(purity),
        {
          usd,
          rub: usd * fx.usdRub,
          amd: usd * fx.usdAmd,
        },
      ];
    }),
  ) as GoldSnapshot["perGram"];

  return {
    updatedAt: new Date().toISOString(),
    source: `${gold.source} + ${fx.source}`,
    xauUsdPerOz: gold.price,
    usdRub: fx.usdRub,
    usdAmd: fx.usdAmd,
    perGram,
  };
}
