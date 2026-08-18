import type { Locale } from "./i18n";
import type { Product } from "./types";

export type FxRates = {
  usdRub: number;
  usdAmd: number;
};

export const FALLBACK_RATES: FxRates = {
  usdRub: 84.91,
  usdAmd: 365.59,
};

export const FREE_DELIVERY_RUB = 25000;
export const DELIVERY_RUB = 790;

function parseSize(value: string) {
  return Number(String(value).replace(",", "."));
}

export function baseSize(product: Product) {
  const nums = product.sizes.map(parseSize).filter((n) => Number.isFinite(n) && n > 0);
  if (!nums.length) return null;
  return nums[Math.floor((nums.length - 1) / 2)];
}

export function defaultSize(product: Product) {
  if (!product.sizes.length) return "";
  const base = baseSize(product);
  if (base == null) return product.sizes[0];
  return product.sizes.find((s) => parseSize(s) === base) || product.sizes[Math.floor((product.sizes.length - 1) / 2)];
}

export function sizeFactor(product: Product, size?: string) {
  if (!size || !product.sizes.length) return 1;
  const base = baseSize(product);
  const selected = parseSize(size);
  if (!base || !selected) return 1;
  return Math.min(1.55, Math.max(0.72, selected / base));
}

export function priceRub(product: Product, size?: string) {
  return Math.round(product.price * sizeFactor(product, size));
}

export function oldPriceRub(product: Product, size?: string) {
  if (!product.oldPrice) return undefined;
  return Math.round(product.oldPrice * sizeFactor(product, size));
}

export function weightForSize(product: Product, size?: string) {
  return Math.round(product.weight * sizeFactor(product, size) * 100) / 100;
}

export function rubToAmount(rub: number, locale: Locale, rates: FxRates) {
  const fx = rates.usdRub > 0 ? rates : FALLBACK_RATES;
  if (locale === "en") return rub / fx.usdRub;
  if (locale === "hy") return (rub / fx.usdRub) * fx.usdAmd;
  return rub;
}

export function formatMoney(rub: number, locale: Locale, rates: FxRates = FALLBACK_RATES) {
  const amount = rubToAmount(rub, locale, rates);
  if (locale === "en") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(Math.round(amount));
  }
  if (locale === "hy") {
    return new Intl.NumberFormat("hy-AM", {
      style: "currency",
      currency: "AMD",
      maximumFractionDigits: 0,
    }).format(Math.round(amount));
  }
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export function currencyCode(locale: Locale) {
  if (locale === "en") return "USD";
  if (locale === "hy") return "AMD";
  return "RUB";
}
