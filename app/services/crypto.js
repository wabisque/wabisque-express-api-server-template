const crypto = require('crypto');

function checkHash(password, hash, salt) {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex') == hash;
}

function makeHash(password) {
  const salt = crypto.randomBytes(32).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

  return { hash, salt }
}

module.exports = {
  checkHash,
  makeHash
}