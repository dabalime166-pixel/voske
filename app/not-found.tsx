"use client";

import Link from "next/link";
import { useI18n } from "@/components/I18nProvider";

export default function NotFound() {
  const { t } = useI18n();
  return (
    <div className="px-8 py-24 text-center">
      <p className="font-serif text-6xl">404</p>
      <p className="mt-4">{t("notfound")}</p>
      <Link href="/" className="btn btn-line mt-6 inline-flex">
        {t("notfound.home")}
      </Link>
    </div>
  );
}
