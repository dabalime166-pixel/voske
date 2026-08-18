# VOSKE

Ювелирный дом золотых украшений для России и Армении. Каталог, админка, заказы и курс золота, который обновляется только по кнопке.

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

## Хостинг (Vercel + GitHub)

Репозиторий для деплоя: [github.com/li1quid/voske](https://github.com/li1quid/voske).

1. Создайте репозиторий `voske` в аккаунте **li1quid** (если его ещё нет) и запушьте эту ветку.
2. На [vercel.com/new](https://vercel.com/new) выберите **Import Git Repository** → `li1quid/voske`.
3. Добавьте переменные окружения из `.env.example`:
   - `ADMIN_PASSWORD` = `voske2026`
   - `ADMIN_SECRET` = `voske-admin-secret-key`
4. Нажмите **Deploy**.

Админка на проде: `/admin`.

## Курс золота

Страница `/gold` хранит последний запрошенный курс и **не обновляется сама**. Нажмите «Обновить курс».
