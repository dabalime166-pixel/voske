import type { Locale } from "./i18n";
import type { Product, Review } from "./types";

type Copy = {
  name: Record<Locale, string>;
  description: Record<Locale, string>;
  reviews?: Record<Locale, string[]>;
};

const C: Record<string, Copy> = {
  "voske-aurora-ring": {
    name: {
      ru: "Кольцо «Северное сияние» с бриллиантом",
      hy: "«Հյուսիսափայլ» մատանի ադամանդով",
      en: "Northern Lights diamond ring",
    },
    description: {
      ru: "Классическое кольцо из красного золота 585 с центральным бриллиантом круглой огранки. Чистая линия каста и тонкая шинкa — в духе хитов 585*Золотой.",
      hy: "Դասական մատանի 585 կարմիր ոսկուց՝ կլոր ադամանդով։ Մաքուր գիծ և բարակ օղակ՝ 585*Золотой հիթերի ոգով։",
      en: "A classic 585 rose-gold ring with a round brilliant. Clean gallery, slim band — in the spirit of 585*Zolotoy bestsellers.",
    },
    reviews: {
      ru: ["Камень играет даже при дневном свете. Размер сел идеально, коробка как в бутике.", "Заказывала как подарок. Муж сказал, что выглядит дороже цены."],
      hy: ["Քարը խաղում է նույնիսկ ցերեկը։ Չափը կատարյալ է, տուփը՝ որպես բուտիկում։", "Պատվիրեցի նվեր։ Ասաց, որ ավելի թանկ է երևում։"],
      en: ["The stone plays even in daylight. Size was perfect, the box felt like a boutique.", "Ordered it as a gift. He said it looks more expensive than the price."],
    },
  },
  "voske-yerevan-drops": {
    name: { ru: "Серьги-капли «Ереван»", hy: "«Երևան» կաթիլ ականջօղեր", en: "Yerevan drop earrings" },
    description: {
      ru: "Удлинённые серьги из жёлтого золота с алмазной гранью. Тёплый металл и вечерний блеск ереванских витрин.",
      hy: "Երկար ականջօղեր դեղին ոսկուց՝ ադամանդե երեսակումով։ Տաք մետաղ և երեկոյան փայլ։",
      en: "Elongated yellow-gold drops with diamond cutting. Warm metal, evening light of Yerevan vitrines.",
    },
    reviews: {
      ru: ["Носила на свадьбу сестры в Эчмиадзине. Золото тёплое, как армянское солнце."],
      hy: ["Կրեցի քրոջս հարսանիքին Էջմիածնում։ Ոսկին տաք է, ինչպես հայկական արևը։"],
      en: ["Wore them to my sister’s wedding in Ejmiatsin. The gold is warm, like Armenian sun."],
    },
  },
  "voske-nar-necklace": {
    name: { ru: "Колье «Нар» с гранатовым зерном", hy: "«Նուռ» վզնոց նռան հատիկով", en: "Nar pomegranate necklace" },
    description: {
      ru: "Тонкая цепь и кулон-гранат — символ Армении и дома. Гранаты глубокого вина в жёлтом золоте 585.",
      hy: "Բարակ շղթա և նռան կախազարդ՝ Հայաստանի և տան խորհրդանիշ։ Գինու խոր գույնի նռնաքարեր 585 ոսկու մեջ։",
      en: "A fine chain and pomegranate pendant — Armenia and home. Wine-dark garnets in 585 yellow gold.",
    },
    reviews: {
      ru: ["Искала именно гранат, не «просто кулон». Здесь и форма, и цвет камня настоящие."],
      hy: ["Փնտրում էի հենց նուռ, ոչ «պարզապես կախազարդ»։ Այստեղ և՛ ձևը, և՛ գույնը իրական են։"],
      en: ["I wanted a pomegranate, not “just a pendant”. The shape and the stone colour are real."],
    },
  },
  "voske-radiance-tennis": {
    name: { ru: "Браслет теннисный «Сияние»", hy: "«Փայլ» թենիս ապարանջան", en: "Radiance tennis bracelet" },
    description: {
      ru: "Ряд камней в жёлтом золоте. Замок-коробка с предохранителем — вечерний браслет в духе SOKOLOV, но плотнее.",
      hy: "Քարերի շարք դեղին ոսկու մեջ։ Արկղային կողպեք ապահովիչով — երեկոյան ապարանջան SOKOLOV ոգով։",
      en: "A line of stones in yellow gold. Box clasp with a safety — evening bracelet in the spirit of SOKOLOV, set denser.",
    },
    reviews: {
      ru: ["Тяжёлый, «дорогой» на руке. Застёжка надёжная — проверяла специально."],
      hy: ["Ծանր է, «թանկ» ձեռքին։ Կողպեքը հուսալի է — հատուկ ստուգեցի։"],
      en: ["Heavy, “expensive” on the wrist. The clasp is solid — I checked on purpose."],
    },
  },
  "voske-ararat-figaro": {
    name: { ru: "Цепь Фигаро «Арарат»", hy: "«Արարատ» ֆիգարո շղթա", en: "Ararat Figaro chain" },
    description: {
      ru: "Мужская цепь Фигаро из золота 585. Плотное звено и заводской блеск в духе NEWGOLD.",
      hy: "Տղամարդու ֆիգարո շղթա 585 ոսկուց։ Խիտ օղակ և գործարանային փայլ NEWGOLD ոգով։",
      en: "Men’s 585 Figaro chain. Dense links and factory polish in the spirit of NEWGOLD.",
    },
    reviews: {
      ru: ["Вес чувствуется, не «проволока». Цвет золота насыщенный."],
      hy: ["Քաշը զգացվում է, ոչ «մետաղալար»։ Ոսկու գույնը հագեցած է։"],
      en: ["You feel the weight — not wire. The gold colour is rich."],
    },
  },
  "voske-surb-khach": {
    name: { ru: "Крест «Сурб Хач» с филигранью", hy: "«Սուրբ Խաչ» ֆիլիգրան խաչ", en: "Surb Khach filigree cross" },
    description: {
      ru: "Армянский крест с растительной филигранью — хачкар в миниатюре. Жёлтое золото 585, ручная проработка лучей.",
      hy: "Հայկական խաչ բուսական ֆիլիգրանով — խաչքար մանրանկարում։ 585 դեղին ոսկի, ձեռքի մշակում։",
      en: "An Armenian cross with botanical filigree — a khachkar in miniature. 585 yellow gold, hand-finished rays.",
    },
    reviews: {
      ru: ["Наконец крест, который выглядит армянским, а не «общецерковным»."],
      hy: ["Վերջապես խաչ, որ հայկական է երևում, ոչ «ընդհանուր եկեղեցական»։"],
      en: ["Finally a cross that looks Armenian, not generically ecclesiastical."],
    },
  },
  "voske-eternity-bands": {
    name: { ru: "Обручальные кольца «Вечность»", hy: "«Հավերժություն» ամուսնական մատանիներ", en: "Eternity wedding bands" },
    description: {
      ru: "Пара классических шин из золота 585: женское 3.5 мм, мужское 5 мм. Эстетика МЮЗ — без камней, на десятилетия.",
      hy: "Դասական զույգ 585 ոսկուց՝ կանացի 3.5 մմ, տղամարդու 5 մմ։ ՄՅՈՒԶ էսթետիկա՝ առանց քարերի։",
      en: "A classic 585 pair: 3.5 mm for her, 5 mm for him. MJZ aesthetic — no stones, built for decades.",
    },
    reviews: {
      ru: ["Взяли пару сразу. Полировка зеркальная, кромка не режет палец."],
      hy: ["Վերցրինք զույգը միանգամից։ Փայլը հայելային է, եզրը չի կտրում։"],
      en: ["We took the pair at once. Mirror polish, the edge doesn’t cut the finger."],
    },
  },
  "voske-rose-hoops": {
    name: { ru: "Серьги-конго из красного золота", hy: "Կարմիր ոսկու կոնգո ականջօղեր", en: "Rose-gold hoop earrings" },
    description: {
      ru: "Средние конго из красного золота с дорожкой камней. Тёплый «русский красный» в духе EFREMOV.",
      hy: "Միջին կոնգո կարմիր ոսկուց՝ քարերի շարքով։ Տաք «ռուսական կարմիր» EFREMOV ոգով։",
      en: "Medium hoops in rose gold with a stone path. Warm “Russian red” in the spirit of EFREMOV.",
    },
  },
  "voske-letter-locket": {
    name: { ru: "Медальон-секрет «Письмо»", hy: "«Նամակ» մեդալիոն-գաղտնիք", en: "Letter secret locket" },
    description: {
      ru: "Открывающийся медальон из жёлтого золота. Внутри — два гнезда для миниатюр или локона.",
      hy: "Բացվող մեդալիոն դեղին ոսկուց։ Ներսում՝ երկու բույն մանրանկարի կամ մազափնջի համար։",
      en: "A yellow-gold locket that opens. Inside: two nests for a miniature or a lock of hair.",
    },
    reviews: {
      ru: ["Положила фото дочки. Замок медальона плотный, не открывается сам."],
      hy: ["Դրեցի աղջկաս լուսանկարը։ Կողպեքը խիտ է, ինքնուրույն չի բացվում։"],
      en: ["I put my daughter’s photo in. The clasp is tight — it doesn’t open on its own."],
    },
  },
  "voske-tsar-signet": {
    name: { ru: "Перстень мужской «Царь»", hy: "«Ցար» տղամարդու մատանի", en: "Tsar men’s signet" },
    description: {
      ru: "Массивный печатка с овальной площадкой из золота 585. Можно гравировать инициалы.",
      hy: "Զանգվածային կնիք մատանի օվալ հարթակով՝ 585 ոսկի։ Կարելի է փորագրել սկզբնատառեր։",
      en: "A substantial 585 signet with an oval face. Initials can be engraved.",
    },
  },
  "voske-sirun-heart": {
    name: { ru: "Браслет «Сирануш» с сердцем", hy: "«Սիրանուշ» ապարանջան սրտիկով", en: "Siranush heart bracelet" },
    description: {
      ru: "Тонкий браслет с шармом-сердцем. Сирануш — «милая» по-армянски. Лёгкое золото 585 на каждый день.",
      hy: "Բարակ ապարանջան սրտիկով։ Սիրանուշ նշանակում է «սիրուն»։ Թեթև 585 ոսկի ամեն օր։",
      en: "A fine bracelet with a heart charm. Siranush means “lovely” in Armenian. Light 585 gold for every day.",
    },
    reviews: {
      ru: ["Нежный, не снимаю. Сердечко не разворачивается на руке."],
      hy: ["Նուրբ է, չեմ հանում։ Սրտիկը ձեռքին չի շրջվում։"],
      en: ["Delicate — I don’t take it off. The heart doesn’t twist on the wrist."],
    },
  },
  "voske-ice-studs": {
    name: { ru: "Пусеты «Лёд» с бриллиантами", hy: "«Սառույց» ադամանդե պուսետներ", en: "Ice diamond studs" },
    description: {
      ru: "Гвоздики из белого золота 585 с бриллиантами. Холодный блеск в духе SUNLIGHT «на каждый день».",
      hy: "Պուսետներ սպիտակ 585 ոսկուց ադամանդներով։ Սառը փայլ SUNLIGHT «ամեն օր» ոգով։",
      en: "585 white-gold studs with diamonds. Cool sparkle in the spirit of SUNLIGHT everyday pieces.",
    },
    reviews: {
      ru: ["Белое золото не желтит. Камни ровные, закрутки удобные."],
      hy: ["Սպիտակ ոսկին չի դեղնում։ Քարերը հավասար են, պտուտակները հարմար։"],
      en: ["The white gold doesn’t yellow. Stones are even, backs are comfortable."],
    },
  },
  "voske-faith-necklace": {
    name: { ru: "Колье «Вера» с крестом", hy: "«Հավատ» վզնոց խաչով", en: "Faith cross necklace" },
    description: {
      ru: "Якорная цепь и небольшой крест с искрами камней. Сдержанная русская салонная классика.",
      hy: "Խարիսխ շղթա և փոքր խաչ քարերի կայծերով։ Զուսպ ռուսական սրահային դասական։",
      en: "An anchor chain and a small cross with stone sparks. Quiet Russian salon classicism.",
    },
  },
  "voske-ararat-medallion": {
    name: { ru: "Медальон «Арарат»", hy: "«Արարատ» մեդալիոն", en: "Ararat medallion" },
    description: {
      ru: "Круглый медальон с горельефом двух вершин Арарата. Матовое поле и полированные снега.",
      hy: "Կլոր մեդալիոն Արարատի երկու գագաթների բարձրաքանդակով։ Մատ ասպարեզ և փայլեցված ձյուն։",
      en: "A round medallion with both peaks of Ararat in relief. Matte field, polished snows.",
    },
    reviews: {
      ru: ["Рельеф глубокий, горы читаются. Ношу вместо обычного кулона."],
      hy: ["Ռելիեֆը խորն է, լեռները կարդացվում են։ Կրում եմ սովորական կախազարդի փոխարեն։"],
      en: ["Deep relief — you can read the mountains. I wear it instead of a usual pendant."],
    },
  },
  "voske-kids-blossom": {
    name: { ru: "Детские серьги «Цветок»", hy: "Մանկական «Ծաղիկ» ականջօղեր", en: "Blossom kids’ earrings" },
    description: {
      ru: "Крошечные цветы из золота 585 с безопасными закрутками. Первый золотой подарок на крестины.",
      hy: "Փոքրիկ ծաղիկներ 585 ոսկուց՝ անվտանգ պտուտակներով։ Առաջին ոսկե նվերը մկրտությանը։",
      en: "Tiny 585 gold flowers with secure backs. A first gold gift for a christening.",
    },
    reviews: {
      ru: ["Лёгкие, дочка не жалуется. Закрутки с гипоаллергенной сталью внутри."],
      hy: ["Թեթև են, աղջիկս չի գանգատվում։ Պտուտակների մեջ հիպոալերգիկ պողպատ կա։"],
      en: ["Light — my daughter doesn’t complain. Backs have hypoallergenic steel inside."],
    },
  },
  "voske-sun-bangle": {
    name: { ru: "Браслет-бэнгл «Солнце»", hy: "«Արև» բանգլ ապարանջան", en: "Sun gold bangle" },
    description: {
      ru: "Жёсткий полированный бэнгл из жёлтого золота. Чистый металл, максимум света — в духе PLATINA.",
      hy: "Կոշտ փայլեցված բանգլ դեղին ոսկուց։ Մաքուր մետաղ, առավելագույն լույս՝ PLATINA ոգով։",
      en: "A rigid polished yellow-gold bangle. Pure metal, maximum light — in the spirit of PLATINA.",
    },
  },
  "voske-garnet-garden": {
    name: { ru: "Кольцо «Гранатовый сад»", hy: "«Նռան այգի» մատանի", en: "Pomegranate Garden ring" },
    description: {
      ru: "Коктейльное кольцо с овальным гранатом. Цвет Еревана, оправа — жёлтое золото 585.",
      hy: "Կոկտեյլ մատանի օվալ նռնաքարով։ Երևանի գույն, շրջանակ՝ 585 դեղին ոսկի։",
      en: "A cocktail ring with an oval garnet. The colour of Yerevan, set in 585 yellow gold.",
    },
    reviews: {
      ru: ["Гранат живой, не чёрный. Кольцо заметное, но не вульгарное."],
      hy: ["Նռնաքարը կենդանի է, ոչ սև։ Մատանին նկատելի է, բայց ոչ գռեհիկ։"],
      en: ["The garnet is alive, not black. The ring is noticed — not vulgar."],
    },
  },
};

export function productName(product: Product, locale: Locale) {
  if (locale === "en" && product.nameEn) return product.nameEn;
  return C[product.id]?.name[locale] || (locale === "hy" ? product.nameHy || product.name : product.name);
}

export function productDescription(product: Product, locale: Locale) {
  if (locale === "en" && product.descriptionEn) return product.descriptionEn;
  if (locale === "hy" && product.descriptionHy) return product.descriptionHy;
  return C[product.id]?.description[locale] || product.description;
}

export function productReviewText(product: Product, review: Review, index: number, locale: Locale) {
  return C[product.id]?.reviews?.[locale]?.[index] || review.text;
}
