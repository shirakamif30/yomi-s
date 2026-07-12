/**
 * HD Quality Rank Card Generator
 * Cultivation-themed with beautiful gradients and effects
 */

const { createCanvas } = require('@napi-rs/canvas');
const path = require('path');
const { getRealmForLevel, getNextRealm } = require('../cultivation');
const { getProgress } = require('../xp');
const config = require('../../../config.json');

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawAvatar(ctx, x, y, radius, borderColor, initial) {
  // Outer glow
  var gradient = ctx.createRadialGradient(x, y, radius - 5, x, y, radius + 10);
  gradient.addColorStop(0, borderColor);
  gradient.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.beginPath();
  ctx.arc(x, y, radius + 10, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();

  // Border
  ctx.beginPath();
  ctx.arc(x, y, radius + 3, 0, Math.PI * 2);
  ctx.fillStyle = borderColor;
  ctx.fill();

  // Avatar background
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = '#2D2B55';
  ctx.fill();
  ctx.save();
  ctx.clip();

  // Initial letter
  ctx.fillStyle = borderColor;
  ctx.font = 'bold ' + radius + 'px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initial, x, y);
  ctx.restore();
}

function getTotalXpForLevel(level) {
  var baseXp = config.leveling.baseXp;
  var multiplier = config.leveling.multiplier;
  var total = 0;
  for (var i = 1; i <= level; i++) {
    total += Math.floor(baseXp * Math.pow(i, multiplier));
  }
  return total;
}

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

function adjustColor(hex, amount) {
  var num = parseInt(hex.replace('#', ''), 16);
  var r = Math.min(255, ((num >> 16) & 0xFF) + amount);
  var g = Math.min(255, ((num >> 8) & 0xFF) + amount);
  var b = Math.min(255, (num & 0xFF) + amount);
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

async function generateRankCard(options) {
  var username = options.username;
  var level = options.level;
  var currentXp = options.currentXp;
  var requiredXp = options.requiredXp;
  var rank = options.rank;
  var totalMessages = options.totalMessages;

  var width = 900;
  var height = 280;
  var canvas = createCanvas(width, height);
  var ctx = canvas.getContext('2d');

  var realm = getRealmForLevel(level);
  var nextRealm = getNextRealm(level);
  var progress = getProgress(currentXp, requiredXp);
  var realmColor = realm.color;

  // Background gradient
  var bgGradient = ctx.createLinearGradient(0, 0, width, height);
  bgGradient.addColorStop(0, '#0F0C29');
  bgGradient.addColorStop(0.5, '#1A1A3E');
  bgGradient.addColorStop(1, '#24243E');
  ctx.fillStyle = bgGradient;
  roundRect(ctx, 0, 0, width, height, 20);
  ctx.fill();

  // Subtle diagonal pattern
  ctx.globalAlpha = 0.03;
  for (var i = 0; i < width; i += 30) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + height, height);
    ctx.strokeStyle = realmColor;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Decorative corner accents
  ctx.strokeStyle = realmColor;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.5;
  
  ctx.beginPath();
  ctx.moveTo(15, 40);
  ctx.lineTo(15, 15);
  ctx.lineTo(40, 15);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(width - 15, 40);
  ctx.lineTo(width - 15, 15);
  ctx.lineTo(width - 40, 15);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(15, height - 40);
  ctx.lineTo(15, height - 15);
  ctx.lineTo(40, height - 15);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(width - 15, height - 40);
  ctx.lineTo(width - 15, height - 15);
  ctx.lineTo(width - 40, height - 15);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Avatar
  var avatarX = 100;
  var avatarY = 140;
  var avatarRadius = 60;
  var initial = username.charAt(0).toUpperCase();
  drawAvatar(ctx, avatarX, avatarY, avatarRadius, realmColor, initial);

  // Username
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 28px sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(username, 190, 50);

  // Cultivation Realm Badge
  ctx.fillStyle = realmColor;
  ctx.globalAlpha = 0.15;
  roundRect(ctx, 190, 90, 220, 35, 8);
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.fillStyle = realmColor;
  ctx.font = 'bold 16px sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText(realm.emoji + ' ' + realm.name + ' ' + realm.chinese, 200, 107);

  // Level display with glow
  var levelText = 'LVL ' + level;
  ctx.font = 'bold 42px sans-serif';
  var levelWidth = ctx.measureText(levelText).width;
  
  ctx.shadowColor = realmColor;
  ctx.shadowBlur = 20;
  ctx.fillStyle = realmColor;
  ctx.fillText(levelText, width - levelWidth - 40, 55);
  ctx.shadowBlur = 0;

  // Rank display
  ctx.fillStyle = '#AAAAAA';
  ctx.font = '18px sans-serif';
  ctx.fillText('Rank #' + rank, width - levelWidth - 40, 105);

  // XP Progress Bar
  var barX = 190;
  var barY = 150;
  var barWidth = 660;
  var barHeight = 30;

  // Bar background
  roundRect(ctx, barX, barY, barWidth, barHeight, 15);
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.fill();

  // Progress fill
  var progressWidth = Math.max(barHeight, (barWidth * progress) / 100);
  var progressGradient = ctx.createLinearGradient(barX, 0, barX + progressWidth, 0);
  progressGradient.addColorStop(0, realmColor);
  progressGradient.addColorStop(1, adjustColor(realmColor, 30));
  roundRect(ctx, barX, barY, progressWidth, barHeight, 15);
  ctx.fillStyle = progressGradient;
  ctx.fill();

  // Progress shine
  ctx.globalAlpha = 0.3;
  roundRect(ctx, barX, barY, progressWidth, barHeight / 2, 15);
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.fill();
  ctx.globalAlpha = 1;

  // XP Text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillText(formatNumber(currentXp) + ' / ' + formatNumber(requiredXp) + ' XP', barX + barWidth - 10, barY + barHeight / 2);

  // Progress percentage
  ctx.textAlign = 'left';
  ctx.fillStyle = '#AAAAAA';
  ctx.font = '13px sans-serif';
  ctx.fillText(progress + '%', barX + 10, barY + barHeight / 2);

  // Stats section
  var statsY = 210;
  ctx.textAlign = 'left';
  
  ctx.fillStyle = '#888888';
  ctx.font = '14px sans-serif';
  ctx.fillText('Total XP', 190, statsY);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText(formatNumber(currentXp + getTotalXpForLevel(level)), 190, statsY + 25);

  ctx.fillStyle = '#888888';
  ctx.font = '14px sans-serif';
  ctx.fillText('Messages', 350, statsY);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText(formatNumber(totalMessages), 350, statsY + 25);

  if (nextRealm) {
    ctx.fillStyle = '#888888';
    ctx.font = '14px sans-serif';
    ctx.fillText('Next Realm', 510, statsY);
    ctx.fillStyle = nextRealm.color;
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(nextRealm.emoji + ' ' + nextRealm.name, 510, statsY + 25);
  }

  // Realm description
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(realm.description, width / 2, height - 20);

  return canvas.toBuffer('image/png');
}

module.exports = { generateRankCard };
