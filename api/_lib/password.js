const crypto = require('crypto');

const SALT_BYTES = 16;
const KEY_BYTES = 64;
const SCRYPT_OPTS = { N: 16384, r: 8, b: 1, p: 1 };

function hashPassword(password) {
  const salt = crypto.randomBytes(SALT_BYTES);
  const derived = crypto.scryptSync(password, salt, KEY_BYTES, SCRYPT_OPTS);
  return `${salt.toString('hex')}:${derived.toString('hex')}`;
}

function verifyPassword(password, stored) {
  if (!stored || !stored.includes(':')) return false;
  const [saltHex, hashHex] = stored.split(':');
  if (!saltHex || !hashHex) return false;
  const salt = Buffer.from(saltHex, 'hex');
  const derived = crypto.scryptSync(password, salt, KEY_BYTES, SCRYPT_OPTS);
  const hash = Buffer.from(hashHex, 'hex');
  if (hash.length !== derived.length) return false;
  return crypto.timingSafeEqual(hash, derived);
}

module.exports = {
  hashPassword,
  verifyPassword
};
