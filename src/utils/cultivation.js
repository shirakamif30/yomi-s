/**
 * Yomi-S Cultivation Realm System
 * Based on classic cultivation novel themes
 */

const REALMS = [
  {
    name: 'Qi Condensation',
    chinese: '\u7ec3\u6c14',
    emoji: '\ud83c\udf2c\ufe0f',
    color: '#7DD3FC',
    levelReq: 0,
    description: 'The beginning of the cultivation path. Sensing and gathering Qi from the heavens and earth.'
  },
  {
    name: 'Foundation Establishment',
    chinese: '\u7b51\u57fa',
    emoji: '\ud83c\udfd7\ufe0f',
    color: '#86EFAC',
    levelReq: 5,
    description: 'Building a solid spiritual foundation. The first true step into the world of cultivation.'
  },
  {
    name: 'Core Formation',
    chinese: '\u7ed3\u4e39',
    emoji: '\ud83d\udc8e',
    color: '#FDE68A',
    levelReq: 10,
    description: 'Condensing spiritual energy into a golden core. Power begins to truly manifest.'
  },
  {
    name: 'Nascent Soul',
    chinese: '\u5143\u5a74',
    emoji: '\ud83d\udc76',
    color: '#C4B5FD',
    levelReq: 20,
    description: 'Giving birth to a spiritual avatar within. Transcending mortal limitations.'
  },
  {
    name: 'Spirit Severing',
    chinese: '\u65a9\u7075',
    emoji: '\u2694\ufe0f',
    color: '#FCA5A5',
    levelReq: 30,
    description: 'Severing worldly attachments to purify the spirit. A test of will and determination.'
  },
  {
    name: 'Dao Seeking',
    chinese: '\u95ee\u9053',
    emoji: '\ud83c\udf00',
    color: '#FDBA74',
    levelReq: 40,
    description: 'Seeking the ultimate truth of the Dao. Understanding the fundamental laws of existence.'
  },
  {
    name: 'Tribulation Transcendence',
    chinese: '\u6e21\u52ab',
    emoji: '\u26a1',
    color: '#E879F9',
    levelReq: 50,
    description: 'Facing heavenly tribulations to prove one\'s worth. Lightning descends to test the cultivator.'
  },
  {
    name: 'True Immortal',
    chinese: '\u771f\u4ed9',
    emoji: '\u2728',
    color: '#67E8F9',
    levelReq: 65,
    description: 'Achieving immortality and transcending the cycle of life and death.'
  },
  {
    name: 'Dao Sovereign',
    chinese: '\u9053\u5c0a',
    emoji: '\ud83d\udc51',
    color: '#FCD34D',
    levelReq: 80,
    description: 'Sovereign of the Dao. Commands the fundamental forces of the universe.'
  },
  {
    name: 'Heavenly Venerable',
    chinese: '\u5929\u5c0a',
    emoji: '\ud83c\udf0c',
    color: '#F9FAFB',
    levelReq: 95,
    description: 'The supreme realm. Standing at the pinnacle of all creation, revered by heaven and earth.'
  }
];

function getRealmForLevel(level) {
  let realm = REALMS[0];
  for (const r of REALMS) {
    if (level >= r.levelReq) {
      realm = r;
    } else {
      break;
    }
  }
  return realm;
}

function getNextRealm(level) {
  const currentRealm = getRealmForLevel(level);
  const currentIndex = REALMS.indexOf(currentRealm);
  if (currentIndex < REALMS.length - 1) {
    return REALMS[currentIndex + 1];
  }
  return null;
}

function getAllRealms() {
  return REALMS;
}

module.exports = { REALMS, getRealmForLevel, getNextRealm, getAllRealms };
