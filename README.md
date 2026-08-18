# VOSKE

Ювелирный дом золотых украшений для России и Армении. Каталог, админка, заказы и курс золота, который обновляется только по кнопке.

## 🚀 Деплой в один клик

Нажми одну из кнопок, чтобы задеплоить себе постоянный сайт:

[<img src="https://vercel.com/button" alt="Deploy with Vercel" height="32">](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdabalime166-pixel%2Fvoske&env=ADMIN_PASSWORD,ADMIN_SECRET&envDescription=Задайте%20пароль%20админа%20и%20секрет%20сессии&project-name=voske&repository-name=voske&demo-title=VOSKE%20Jewelry&demo-description=Ювелирный%20дом%20ВОСКЕ%20—%20каталог%2C%20курс%20золота%2C%20заказы.)
&nbsp;&nbsp;
[<img src="https://www.netlify.com/img/deploy/button.svg" alt="Deploy to Netlify" height="32">](https://app.netlify.com/start/deploy?repository=https%3A%2F%2Fgithub.com%2Fdabalime166-pixel%2Fvoske)

**Инструкция для Vercel (рекомендуется):**
1. Жми кнопку «Deploy with Vercel» выше.
2. Войди через GitHub/Google/email — это бесплатно.
3. Vercel спросит переменные `ADMIN_PASSWORD` и `ADMIN_SECRET` — введи любой пароль (например, `voske2026`) и случайную строку для секрета.
4. Через ~60 секунд получишь URL вида `voske-xxx.vercel.app` — это и есть твой постоянный домен. Отправляй его друзьям!

## Запуск

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## Админка

- Адрес: `/admin`
- Пароль по умолчанию: `voske2026`
- Переменные: `ADMIN_PASSWORD`, `ADMIN_SECRET`

В админке можно добавлять, править и удалять товары (все параметры), получать уведомления о заказах с данными покупателя.

После покупки гость получает телефон отслеживания **099 054 713** и поддержку Telegram **[@themoonberry](https://t.me/themoonberry)**.

## Курс золота

Страница `/gold` хранит последний запрошенный курс и **не обновляется сама**. Нажмите «Обновить курс».
