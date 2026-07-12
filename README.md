# Yomi-S Cultivation Discord Bot

A high-quality Discord leveling system with cultivation-themed roles and HD rank cards.

---

## 📋 CHANGELOG — Pembaruan Kode

> **⚠️ PENTING UNTUK AI AGENT:** Bagian ini wajib dibaca sebelum melakukan perubahan kode.
> Setiap pembaruan **HARUS** dicatat di sini dengan format yang sama agar agent AI selanjutnya
> dapat memahami riwayat perubahan tanpa harus membaca seluruh kode.

### Format Entri Changelog
```
### [YYYY-MM-DD] Judul Pembaruan
- **File yang diubah:** `path/to/file.js`
- **Apa yang berubah:** Deskripsi singkat
- **Alasan:** Mengapa perubahan dilakukan
- **Status:** ✅ Selesai / 🔄 Dalam Proses / ⚠️ Perlu Perhatian
```

---

### [2026-07-12] Initial Release — Pembuatan Awal Bot
- **File yang diubah:** Semua file (initial commit)
- **Apa yang berubah:**
  - Struktur project lengkap dengan folder `src/commands`, `src/events`, `src/utils`
  - 7 slash commands: `/installrole`, `/rank`, `/leaderboard`, `/realminfo`, `/setlevelchannel`, `/givexp`, `/resetlevel`
  - Sistem leveling dengan 10 cultivation realm (Qi Condensation → Heavenly Venerable)
  - HD rank card generator menggunakan `@napi-rs/canvas`
  - Database SQLite menggunakan `better-sqlite3`
  - Auto role assignment saat user level up
  - Anti-spam cooldown 60 detik per pesan
  - Token disimpan di `config.json` (karena env token di-lock pada host)
- **Alasan:** Pembuatan awal bot sesuai permintaan user
- **Status:** ✅ Selesai

---

### [2026-07-12] Changelog Section Ditambahkan
- **File yang diubah:** `README.md`
- **Apa yang berubah:** Menambahkan section CHANGELOG agar AI agent masa depan dapat melacak perubahan kode
- **Alasan:** User meminta baris pembaruan terbaru sebagai pengingat untuk agent AI jika berganti
- **Status:** ✅ Selesai

---

## Catatan untuk AI Agent

1. **SELALU update section CHANGELOG** di atas setiap kali mengubah kode
2. **Jangan hapus entri lama** — tambahkan entri baru di bagian paling atas (setelah header)
3. **Catat file yang diubah** secara spesifik agar mudah di-trace
4. **Jelaskan alasan** perubahan, bukan hanya apa yang berubah
5. Struktur project dan arsitektur saat ini:
   - Entry point: `index.js`
   - Commands: `src/commands/*.js` (format: export `{ data, execute }`)
   - Events: `src/events/*.js` (format: export `{ name, once, execute }`)
   - Utils: `src/utils/` (cultivation.js, xp.js, database.js, embeds.js, cards/rankCard.js)
   - Database: SQLite (`yomi.db` auto-generated)
   - Config: `config.json` (token, clientId, leveling settings)

---

## Features

- **Cultivation Leveling System** - Gain XP by chatting and level up through 10 cultivation realms
- **HD Rank Cards** - Beautiful gradient rank cards with cultivation realm info
- **Auto Role Assignment** - Automatically assigns cultivation roles on level up
- **Leaderboard** - Server-wide cultivation leaderboard
- **Admin Commands** - Give XP, reset levels, set notification channels

## Cultivation Realms

| Level | Realm | Chinese | Color |
|-------|-------|---------|-------|
| 0 | Qi Condensation | 练气 | Sky Blue |
| 5 | Foundation Establishment | 筑基 | Emerald Green |
| 10 | Core Formation | 结丹 | Golden |
| 20 | Nascent Soul | 元婴 | Violet |
| 30 | Spirit Severing | 斩灵 | Crimson |
| 40 | Dao Seeking | 问道 | Amber |
| 50 | Tribulation Transcendence | 渡劫 | Magenta |
| 65 | True Immortal | 真仙 | Cyan |
| 80 | Dao Sovereign | 道尊 | Royal Gold |
| 95 | Heavenly Venerable | 天尊 | Celestial White |

## Commands

| Command | Description |
|---------|-------------|
| `/installrole` | Install cultivation roles to server (Admin) |
| `/rank` | View your or another user's rank card |
| `/leaderboard` | View server cultivation leaderboard |
| `/realminfo` | View all cultivation realms info |
| `/setlevelchannel` | Set level-up notification channel (Admin) |
| `/givexp` | Give XP to a user (Admin) |
| `/resetlevel` | Reset a user's level (Admin) |

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure `config.json` with your bot token and client ID
4. Deploy commands: `node src/deploy.js`
5. Start the bot: `npm start`

## Configuration

Edit `config.json`:

```json
{
  "token": "YOUR_BOT_TOKEN_HERE",
  "clientId": "YOUR_CLIENT_ID_HERE",
  "leveling": {
    "xpMin": 15,
    "xpMax": 25,
    "cooldownMs": 60000,
    "baseXp": 100,
    "multiplier": 1.5
  }
}
```

## Hosting

- **Startup file**: `index.js`
- **Token storage**: `config.json` (since env token is locked on host)
- **Node.js**: v20+ (compatible with Node.js 24)

## License

MIT
