// Telegram guruh yoki shaxsiy chat ID sini topish.
// 1) Botni guruhga qo'shing va guruhga istalgan xabar yozing (yoki botga shaxsiy /start yuboring).
// 2) .env ichida TELEGRAM_BOT_TOKEN ni yozing.
// 3) node get-chat-id.js
const fs = require("fs");
const path = require("path");
const env = path.join(__dirname, ".env");
if (fs.existsSync(env)) for (const l of fs.readFileSync(env, "utf8").split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/); if (m && !(m[1] in process.env)) process.env[m[1]] = m[2];
}
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) { console.error(".env faylida TELEGRAM_BOT_TOKEN yo'q"); process.exit(1); }
fetch(`https://api.telegram.org/bot${token}/getUpdates`).then((r) => r.json()).then((d) => {
  if (!d.ok) return console.error("Xato:", d.description);
  const chats = new Map();
  for (const u of d.result) {
    const c = (u.message || u.my_chat_member || u.channel_post || {}).chat;
    if (c) chats.set(c.id, c.title || [c.first_name, c.last_name].filter(Boolean).join(" ") || c.username);
  }
  if (!chats.size) return console.log("Hech narsa topilmadi. Guruhga yoki botga yangi xabar yozib, qayta urinib ko'ring.");
  for (const [id, name] of chats) console.log(`${name}:  TELEGRAM_CHAT_ID=${id}`);
});
