# Yomi-S Cultivation Discord Bot

A high-quality Discord leveling system with cultivation-themed roles and HD rank cards.

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


- **Startup file**: `index.js`
- **Token storage**: `config.json` (since env token is locked)

## License

MIT
