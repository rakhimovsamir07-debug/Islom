# Buxoro Med Academy — sayt

Formadan kelgan so'rovlar Telegram'ga xabar bo'lib keladi. Bot tokeni faqat serverda (`.env` faylida) saqlanadi, sayt sahifasida ko'rinmaydi.

## 1. Telegram bot yaratish
1. Telegram'da **@BotFather** ni oching → `/newbot` → bot nomi va username kiriting.
2. BotFather bergan **tokenni** nusxalang (`123456789:AA...` ko'rinishida).

## 2. Xabarlar qayerga kelishini tanlash
- **Guruhga** (tavsiya: bir nechta admin ko'radi): guruh yarating, botni guruhga qo'shing va guruhga istalgan xabar yozing.
- **Shaxsan o'zingizga**: botni oching va `/start` bosing.

## 3. Sozlash
```bash
cp .env.example .env
```
`.env` ichida `TELEGRAM_BOT_TOKEN=` ga tokenni yozing, keyin chat ID ni toping:
```bash
node get-chat-id.js
```
Chiqqan `TELEGRAM_CHAT_ID=...` qatorini `.env` ga yozing (guruh ID si odatda `-100` bilan boshlanadi).

## 4. Ishga tushirish
```bash
node server.js
```
Sayt: http://localhost:5173. Formani to'ldirib ko'ring, Telegram'ga xabar kelishi kerak.

## Xostingga joylash
Node.js ishlaydigan istalgan xosting mos keladi (VPS, Render, Railway va boshqalar). Shu papkani yuklang, xosting panelida `TELEGRAM_BOT_TOKEN` va `TELEGRAM_CHAT_ID` muhit o'zgaruvchilarini kiriting va `node server.js` buyrug'ini ishga tushiring. Tashqi kutubxona kerak emas (Node 18+).

## Himoya
- Server ism va telefonni qayta tekshiradi.
- Ko'rinmas "honeypot" maydoni spam-botlarni to'xtatadi.
- Bitta IP'dan 10 daqiqada 5 tadan ortiq so'rov qabul qilinmaydi.
- `.env`, `server.js` va boshqa xizmat fayllari brauzerga berilmaydi.
- `.env` ni hech kimga bermang va GitHub'ga yuklamang (`.gitignore` da bor).
