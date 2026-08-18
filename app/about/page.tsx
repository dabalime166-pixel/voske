"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/components/I18nProvider";

export default function AboutPage() {
  const { t } = useI18n();
  return (
    <div>
      <section className="relative min-h-[46vh]">
        <Image src="/images/voske-salon.jpg" alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 mx-auto flex min-h-[46vh] max-w-5xl flex-col justify-end px-4 pb-12 md:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/60">{t("about.kicker")}</p>
          <h1 className="font-serif text-5xl text-white md:text-6xl">{t("about.title")}</h1>
        </div>
      </section>
      <article className="mx-auto max-w-3xl px-4 py-16 leading-8 md:px-0">
        <p>{t("about.p1")}</p>
        <p className="mt-6">{t("about.p2")}</p>
        <p className="mt-6">{t("about.p3")}</p>
        <Link href="/catalog" className="btn btn-line mt-10 inline-flex">
          {t("about.cta")}
        </Link>
      </article>
    </div>
  );
}
