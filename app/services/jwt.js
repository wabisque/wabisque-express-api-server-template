const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const moment = require('moment');

const models = require('../database/models');

const config = require('../config/jwt');
const jwtKeysDir = path.join(__dirname, '../keys');

function generateKeyPairs() {
  const accessKeyPair = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'pkcs1',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem'
    }
  });
  const refreshKeyPair = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'pkcs1',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem'
    }
  });

  fs.writeFileSync(path.join(jwtKeysDir, 'jwt_access_rsa_pub.pem'), accessKeyPair.publicKey);
  fs.writeFileSync(path.join(jwtKeysDir, 'jwt_access_rsa_priv.pem'), accessKeyPair.privateKey);
  fs.writeFileSync(path.join(jwtKeysDir, 'jwt_refresh_rsa_pub.pem'), refreshKeyPair.publicKey);
  fs.writeFileSync(path.join(jwtKeysDir, 'jwt_refresh_rsa_priv.pem'), refreshKeyPair.privateKey);
}

function initialize() {
  const keys = fs.readdirSync(jwtKeysDir);

  const options = [
    'jwt_access_rsa_pub.pem',
    'jwt_access_rsa_priv.pem',
    'jwt_refresh_rsa_pub.pem',
    'jwt_refresh_rsa_priv.pem',
  ];

  options.forEach(opt => { if(!keys.includes(opt)) return generateKeyPairs() })
}

async function generateAccessToken(userDbInstance) {
  try {
    const PRIV_ACCESS_KEY = fs.readFileSync(path.join(jwtKeysDir, 'jwt_access_rsa_priv.pem'), 'utf8');

    await userDbInstance.revokeAllAccessTokens();

    const accessTokenDbInstance = await models.AccessToken.create({
      user_id: userDbInstance.id,
      expires_at: moment().add(config.accessTokenExpiry, 's').format()
    });

    const payload = {
      sub: accessTokenDbInstance.id,
      iat: moment(accessTokenDbInstance.created_at).unix(),
    };

    const accessToken = jwt.sign(payload, PRIV_ACCESS_KEY, { expiresIn: config.accessTokenExpiry, algorithm: 'RS256' });

    return {
      token_type: 'Bearer',
      access_token: accessToken,
      access_expires_at: moment(accessTokenDbInstance.created_at).add(config.accessTokenExpiry, 's').unix()
    }
  } catch (error) {
    throw error;
  }
}

async function generateRefreshToken(userDbInstance) {
  try {
    const PRIV_REFRESH_KEY = fs.readFileSync(path.join(jwtKeysDir, 'jwt_refresh_rsa_priv.pem'), 'utf8');

    await userDbInstance.revokeAllRefreshTokens();

    const refreshTokenDbInstance = await models.RefreshToken.create({
      user_id: userDbInstance.id,
      expires_at: moment().add(config.refreshTokenExpiry, 's').format()
    });

    const payload = {
      sub: refreshTokenDbInstance.id,
      iat: moment(refreshTokenDbInstance.created_at).unix(),
    };

    const refreshToken = jwt.sign(payload, PRIV_REFRESH_KEY, { expiresIn: config.refreshTokenExpiry, algorithm: 'RS256' });

    return {
      token_type: 'Bearer',
      refresh_token: refreshToken,
      refresh_expires_at: moment(refreshTokenDbInstance.created_at).add(config.refreshTokenExpiry, 's').unix()
    }
  } catch (error) {
    throw error
  }
}

async function generateFullToken(userDbInstance) {
  try {
    const accessToken = await generateAccessToken(userDbInstance);
    const refreshToken = await generateRefreshToken(userDbInstance);
  
    return Object.assign({}, accessToken, refreshToken);
  } catch (error) {
    throw error
  }
}

async function verifyAccessToken(accessToken) {
  try {
    const PUB_ACCESS_KEY = fs.readFileSync(path.join(jwtKeysDir, 'jwt_access_rsa_pub.pem'), 'utf8');
    const payload = jwt.verify(accessToken, PUB_ACCESS_KEY, { algorithms: ['RS256'] });

    if(!payload) return false;

    const accessTokenDbInstance = await models.AccessToken.findOne({ where: { id: payload.sub, revoked_at: null } });

    if(!accessTokenDbInstance) return false;
    
    return accessTokenDbInstance
  } catch (error) {
    return false
  }
}

async function verifyRefreshToken(refreshToken) {
  try {
    const PUB_REFRESH_KEY = fs.readFileSync(path.join(jwtKeysDir, 'jwt_refresh_rsa_pub.pem'), 'utf8');
    const payload = jwt.verify(refreshToken, PUB_REFRESH_KEY, { algorithms: ['RS256'] });

    if(!payload) return false;

    const refreshTokenDbInstance = await models.RefreshToken.findOne({ where: { id: payload.sub, revoked_at: null } });

    if(!refreshTokenDbInstance || !!refreshTokenDbInstance.revoked_at) return false;
    
    return refreshTokenDbInstance
  } catch (error) {
    return false
  }
}

module.exports = {
  initialize,
  generateAccessToken,
  generateRefreshToken,
  generateFullToken,
  verifyAccessToken,
  verifyRefreshToken
}