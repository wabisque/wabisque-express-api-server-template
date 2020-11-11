const models = require('../../database/models');

const checkAuthGuardMiddleware = require('./check-auth');

function exec(roles = []) {
  async function check(req, res, next) {
    const authorizationErrorObject = {
      name: 'authorization',
      notifyTypes: [ 'Authorization Error' ]
    };

    if(Array.isArray(roles) && roles.length > 0) roles = roles.map(async role => {
      if(!role) return null;

      if(typeof role == 'string' || role instanceof String) return await models.Role.findOne({ where: { name: role } });

      return role
    }).filter(role => !!role);
    else if(typeof roles == 'string' || roles instanceof String) roles = await models.Role.findOne({ where: { name: roles } });

    if(await req.user.hasAnyRoles(roles)) next();
    else next(authorizationErrorObject);
  }

  return [ ...checkAuthGuardMiddleware(), check ]
}

module.exports = exec