/**
 * XP Calculation System
 */

const config = require('../../config.json');

function getXpForLevel(level) {
  const { baseXp, multiplier } = config.leveling;
  return Math.floor(baseXp * Math.pow(level, multiplier));
}

function getTotalXpForLevel(level) {
  let total = 0;
  for (let i = 1; i <= level; i++) {
    total += getXpForLevel(i);
  }
  return total;
}

function getLevelFromXp(totalXp) {
  let level = 0;
  let remainingXp = totalXp;

  while (true) {
    const xpNeeded = getXpForLevel(level + 1);
    if (remainingXp >= xpNeeded) {
      remainingXp -= xpNeeded;
      level++;
    } else {
      break;
    }
  }

  return {
    level,
    currentXp: remainingXp,
    requiredXp: getXpForLevel(level + 1)
  };
}

function getRandomXp() {
  const { xpMin, xpMax } = config.leveling;
  return Math.floor(Math.random() * (xpMax - xpMin + 1)) + xpMin;
}

function getProgress(currentXp, requiredXp) {
  return Math.min(100, Math.floor((currentXp / requiredXp) * 100));
}

module.exports = {
  getXpForLevel,
  getTotalXpForLevel,
  getLevelFromXp,
  getRandomXp,
  getProgress
};
