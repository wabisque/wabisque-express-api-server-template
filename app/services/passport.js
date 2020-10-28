const fs = require('fs');
const path = require('path');
const passport = require('passport');
const passportJwt = require('passport-jwt');
const moment = require('moment');

const models = require('../database/models');

const PUB_ACCESS_KEY = fs.readFileSync(path.join(__dirname, '../keys/jwt_access_rsa_pub.pem'));

const options = {
  jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_ACCESS_KEY,
  algorithms: [ 'RS256' ],
  ignoreExpiration: true
};

const strategy_jwt = new passportJwt.Strategy(options, async function (payload, done) {
  try {
    const accessTokenDbInstance = await models.AccessToken.findOne({ where: { id: payload.sub, revoked_at: null } });

    const authorizationErrorObject = {
      name: 'authorizationError',
      notifyTypes: [ 'Authorization Error' ]
    };

    if(!accessTokenDbInstance) done(authorizationErrorObject, false);
    else {
      if(payload.exp <= moment().unix()) {
        await accessTokenDbInstance.revoke();
        done(authorizationErrorObject, false);
      }
      else if(moment(accessTokenDbInstance.expires_at).unix() <= moment().unix()) {
        await accessTokenDbInstance.revoke();
        done(authorizationErrorObject, false);
      } else {
        const userDbInstance = await accessTokenDbInstance.getUser();

        if(!userDbInstance) done(authorizationErrorObject, false);
        else done(null, userDbInstance)
      }
    }
  } catch (error) {
    return done(error, null)
  }
});

function initialize(app) {
  passport.use(strategy_jwt);

  app.use(passport.initialize())
}

module.exports = { initialize }