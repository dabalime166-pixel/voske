import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div>
      <section className="relative min-h-[46vh]">
        <Image src="/images/voske-salon.jpg" alt="Салон VOSKE" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 mx-auto flex min-h-[46vh] max-w-5xl flex-col justify-end px-4 pb-12 md:px-8">
          <p className="text-xs uppercase tracking-[0.32em] text-[var(--gold-bright)]">ՈՍԿԵ</p>
          <h1 className="font-serif text-5xl text-[var(--cream)] md:text-6xl">Дом, где золото говорит на двух языках</h1>
        </div>
      </section>
      <article className="mx-auto max-w-3xl px-4 py-16 leading-8 md:px-0">
        <p>
          VOSKE — «золотой» по-армянски. Мы смотрели, как устроены витрины 585*Золотой, SOKOLOV, МЮЗ, SUNLIGHT, EFREMOV, NEWGOLD и PLATINA: фильтры по пробе, хиты, честный вес, свадебный зал. И как армянские дома хранят гранат, хачкар и Арарат.
        </p>
        <p className="mt-6">
          Отсюда витрина: русская салонная классика рядом с ереванской филигранью. Каждое демо-изделие подписано «в духе» большого бренда — чтобы показать, как VOSKE собирает лучшее из двух рынков, не выдавая себя за чужой завод.
        </p>
        <p className="mt-6">
          Курс золота живёт отдельно и обновляется только вручную. Админка знает каждый заказ целиком: имя, телефон, адрес, состав. Гость получает один номер отслеживания и живой Telegram.
        </p>
        <Link href="/catalog" className="mt-10 inline-block border border-[var(--ink)] px-6 py-3 text-sm uppercase tracking-[0.16em]">
          К украшениям
        </Link>
      </article>
    </div>
  );
}
