/**
 * Database Manager using better-sqlite3
 */

const Database = require('better-sqlite3');
const path = require('path');

class DatabaseManager {
  constructor() {
    this.db = new Database(path.join(process.cwd(), 'yomi.db'));
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('synchronous = NORMAL');
    this.initialize();
  }

  initialize() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        guild_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        xp INTEGER DEFAULT 0,
        level INTEGER DEFAULT 0,
        messages INTEGER DEFAULT 0,
        last_xp_time INTEGER DEFAULT 0,
        PRIMARY KEY (guild_id, user_id)
      )
    `);

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS guild_settings (
        guild_id TEXT PRIMARY KEY,
        level_channel TEXT DEFAULT NULL,
        roles_installed INTEGER DEFAULT 0
      )
    `);

    this.stmts = {
      getUser: this.db.prepare('SELECT * FROM users WHERE guild_id = ? AND user_id = ?'),
      upsertUser: this.db.prepare(`
        INSERT INTO users (guild_id, user_id, xp, level, messages, last_xp_time)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(guild_id, user_id) DO UPDATE SET
          xp = excluded.xp,
          level = excluded.level,
          messages = excluded.messages,
          last_xp_time = excluded.last_xp_time
      `),
      addXp: this.db.prepare(`
        UPDATE users SET xp = xp + ?, messages = messages + 1, last_xp_time = ?
        WHERE guild_id = ? AND user_id = ?
      `),
      setLevel: this.db.prepare('UPDATE users SET level = ? WHERE guild_id = ? AND user_id = ?'),
      getLeaderboard: this.db.prepare('SELECT * FROM users WHERE guild_id = ? ORDER BY xp DESC LIMIT ?'),
      getUserRank: this.db.prepare('SELECT COUNT(*) as rank FROM users WHERE guild_id = ? AND xp > (SELECT xp FROM users WHERE guild_id = ? AND user_id = ?)'),
      resetUser: this.db.prepare('UPDATE users SET xp = 0, level = 0, messages = 0 WHERE guild_id = ? AND user_id = ?'),
      getGuildSettings: this.db.prepare('SELECT * FROM guild_settings WHERE guild_id = ?'),
      setLevelChannel: this.db.prepare(`
        INSERT INTO guild_settings (guild_id, level_channel)
        VALUES (?, ?)
        ON CONFLICT(guild_id) DO UPDATE SET level_channel = excluded.level_channel
      `),
      setRolesInstalled: this.db.prepare(`
        INSERT INTO guild_settings (guild_id, roles_installed)
        VALUES (?, 1)
        ON CONFLICT(guild_id) DO UPDATE SET roles_installed = 1
      `)
    };
  }

  getUser(guildId, userId) {
    let user = this.stmts.getUser.get(guildId, userId);
    if (!user) {
      this.stmts.upsertUser.run(guildId, userId, 0, 0, 0, 0);
      user = this.stmts.getUser.get(guildId, userId);
    }
    return user;
  }

  addXp(guildId, userId, xp) {
    const now = Date.now();
    this.ensureUser(guildId, userId);
    this.stmts.addXp.run(xp, now, guildId, userId);
    return this.stmts.getUser.get(guildId, userId);
  }

  setLevel(guildId, userId, level) {
    this.ensureUser(guildId, userId);
    this.stmts.setLevel.run(level, guildId, userId);
  }

  ensureUser(guildId, userId) {
    const user = this.stmts.getUser.get(guildId, userId);
    if (!user) {
      this.stmts.upsertUser.run(guildId, userId, 0, 0, 0, 0);
    }
  }

  getLeaderboard(guildId, limit = 10) {
    return this.stmts.getLeaderboard.all(guildId, limit);
  }

  getUserRank(guildId, userId) {
    const result = this.stmts.getUserRank.get(guildId, guildId, userId);
    return result.rank + 1;
  }

  resetUser(guildId, userId) {
    this.stmts.resetUser.run(guildId, userId);
  }

  getGuildSettings(guildId) {
    let settings = this.stmts.getGuildSettings.get(guildId);
    if (!settings) {
      settings = { guild_id: guildId, level_channel: null, roles_installed: 0 };
    }
    return settings;
  }

  setLevelChannel(guildId, channelId) {
    this.stmts.setLevelChannel.run(guildId, channelId);
  }

  setRolesInstalled(guildId) {
    this.stmts.setRolesInstalled.run(guildId);
  }

  close() {
    this.db.close();
  }
}

const db = new DatabaseManager();
module.exports = db;
