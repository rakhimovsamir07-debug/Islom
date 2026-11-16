// Buxoro Med Academy — sayt serveri.
// Statik fayllarni beradi va /api/lead orqali formadan kelgan so'rovni Telegram'ga yuboradi.
// Bot tokeni faqat serverda turadi, brauzerga hech qachon chiqmaydi.
// Ishga tushirish: node server.js   (Node 18+; tashqi kutubxona kerak emas)

const http = require("http");
const fs = require("fs");
const path = require("path");

// ---- .env faylini o'qish (dotenv kutubxonasisiz) ----
const envFile = path.join(__dirname, ".env");
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const PORT = +process.env.PORT || 5173;
const TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";
const TG_API = process.env.TELEGRAM_API_BASE || "https://api.telegram.org"; // sinov uchun almashtirish mumkin
const ROOT = __dirname;

const MIME = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml",
  ".ico": "image/x-icon", ".json": "application/json; charset=utf-8",
};
const PRIVATE = new Set(["server.js", ".env", ".env.example", "get-chat-id.js", "README.md"]);

const COURSES = ["Maslahat kerak", "Biologiya", "Kimyo", "Majburiy fanlar", "Hamshiralik", "Rus tili", "Ingliz tili"];
const BRANCHES = ["Chirchiq", "Qibray", "G'azalkent"];

// ---- Oddiy spam himoyasi: bitta IP'dan 10 daqiqada 5 tadan ko'p so'rov yo'q ----
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now(), win = 10 * 60 * 1000;
  const list = (hits.get(ip) || []).filter((t) => now - t < win);
  list.push(now);
  hits.set(ip, list);
  return list.length > 5;
}

const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);

function json(res, code, obj) {
  res.writeHead(code, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(obj));
}

function readBody(req, limit = 10_000) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > limit) { reject(new Error("too large")); req.destroy(); }
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

async function handleLead(req, res) {
  if (!TOKEN || !CHAT_ID) return json(res, 500, { ok: false, error: "Telegram sozlanmagan (.env faylini tekshiring)" });

  let body;
  try { body = JSON.parse(await readBody(req)); } catch { return json(res, 400, { ok: false, error: "Noto'g'ri so'rov" }); }

  // Honeypot: odam ko'rmaydigan maydon to'ldirilgan bo'lsa — bot. Jim "muvaffaqiyat" qaytaramiz.
  if (body.website) return json(res, 200, { ok: true });

  const name = String(body.name || "").trim().slice(0, 80);
  const digits = String(body.phone || "").replace(/\D/g, "").replace(/^998/, "");
  const course = COURSES.includes(body.course) ? body.course : "Maslahat kerak";
  const branch = BRANCHES.includes(body.branch) ? body.branch : "—";
  if (name.length < 2 || digits.length !== 9) return json(res, 400, { ok: false, error: "Ism yoki telefon noto'g'ri" });

  const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").toString().split(",")[0].trim();
  if (rateLimited(ip)) return json(res, 429, { ok: false, error: "Juda ko'p so'rov. Birozdan keyin urinib ko'ring." });

  const phone = `+998 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7)}`;
  const time = new Date().toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" });
  const text =
    `🆕 <b>Yangi so'rov — saytdan</b>\n\n` +
    `👤 <b>Ism:</b> ${esc(name)}\n` +
    `📞 <b>Telefon:</b> ${esc(phone)}\n` +
    `📚 <b>Yo'nalish:</b> ${esc(course)}\n` +
    `📍 <b>Filial:</b> ${esc(branch)}\n` +
    `🕒 ${esc(time)}`;

  try {
    const r = await fetch(`${TG_API}/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: "HTML" }),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok || !data.ok) {
      console.error("Telegram xatosi:", r.status, data.description || "");
      return json(res, 502, { ok: false, error: "Yuborib bo'lmadi" });
    }
    return json(res, 200, { ok: true });
  } catch (e) {
    console.error("Telegram'ga ulanib bo'lmadi:", e.message);
    return json(res, 502, { ok: false, error: "Yuborib bo'lmadi" });
  }
}

function serveStatic(req, res) {
  let rel = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (rel.endsWith("/")) rel += "index.html";
  const file = path.normalize(path.join(ROOT, rel));
  const base = path.basename(file);
  if (!file.startsWith(ROOT) || PRIVATE.has(base) || base.startsWith(".")) { res.writeHead(404); return res.end("Topilmadi"); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end("Topilmadi"); }
    res.writeHead(200, { "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream" });
    res.end(data);
  });
}

http.createServer((req, res) => {
  if (req.url === "/api/lead" && req.method === "POST") return handleLead(req, res);
  if (req.method === "GET" || req.method === "HEAD") return serveStatic(req, res);
  res.writeHead(405); res.end();
}).listen(PORT, () => {
  console.log(`Sayt: http://localhost:${PORT}`);
  if (!TOKEN || !CHAT_ID) console.warn("Diqqat: TELEGRAM_BOT_TOKEN yoki TELEGRAM_CHAT_ID yo'q — forma ishlamaydi. README.md ga qarang.");
});
