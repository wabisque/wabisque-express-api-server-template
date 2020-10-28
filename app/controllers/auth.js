const models = require('../database/models');

const cryptoService = require('../services/crypto');
const jwtService = require('../services/jwt');

const checkAuthGuardMiddleware = require('../middleware/guards/check-auth');

function login() {
  async function firstStep(req, res, next) {
    const validationSchema = {
      identifier: {
        type: 'string',
        empty: false,
      },
      password: {
        type: 'string',
        empty: false,
      }
    };
    
    try {
      const validated = req.validate(validationSchema);

      if(validated !== true) next({
        name: 'requestValidationError',
        notifyTypes: [ 'Invalid Credentials' ],
        errors: validated
      });
      else {
        const userDbInstance = await models.User.findOne({
          where: {
            [models.Sequelize.Op.or]: [
              { email: req.body.identifier },
              { username: req.body.identifier }
            ]
          }
        });

        if(!userDbInstance) next({
          name: 'authenticationError',
          notifyTypes: [ 'Unknown Credentials' ],
        });
        else {
          if(cryptoService.checkHash(req.body.password, userDbInstance.hash, userDbInstance.salt)) res.send({
            notifications: [ req.notify('Authentication Successful', `Welcome back, ${userDbInstance.first_name} ${userDbInstance.last_name}.`) ],
            user: await userDbInstance.getSafeDataForFrontend(),
            token: await jwtService.generateFullToken(userDbInstance)
          });
          else next({
            name: 'authenticationError',
            notifyTypes: [ 'Inconsistent Credentials' ],
          })
        }
      }
    } catch (error) {
      next({
        ...error,
        notifyTypes: [ 'Server Error' ], 
      })
    }
  }

  return [ firstStep ]
}

function logout() {
  async function firstStep(req, res, next) {
    try {
      await req.user.revokeAllAccessTokens();
      await req.user.revokeAllRefreshTokens();
      res.send({ notifications: [ req.notify('Logout Successful', `Goodbye, ${req.user.username}.`) ] })
    } catch (error) {
      next({ 
        ...error,
        notifyTypes: [ 'Server Error' ], 
      })
    }
  }

  return [
    ...checkAuthGuardMiddleware(),
    firstStep
  ]
}

function register() {
  async function firstStep(req, res, next) {
    const validationSchema = {
      first_name: {
        type: 'string',
        empty: false,
        pattern: /^([A-Za-z]*[-'])*([A-Za-z]+)$/,
        max: 100,
        min: 2
      },
      last_name: {
        type: 'string',
        empty: false,
        pattern: /^([A-Za-z]*[-'])*([A-Za-z]+)$/,
        max: 100,
        min: 2
      },
      other_names: {
        type: 'string',
        optional: true,
        required: false,
        pattern: /^([A-Za-z]*[-'])*([A-Za-z]+)(\s([A-Za-z]*[-'])*([A-Za-z]+))*$/,
        max: 100,
        min: 2
      },
      email: {
        type: 'email',
        empty: false,
        max: 254
      },
      username: {
        type: 'string',
        optional: true,
        pattern: /^[a-zA-Z\d-_^]+$/,
        min: 4,
        max: 100
      },
      phone_number: {
        type: 'string',
        optional: true,
        numeric: true,
        pattern: /^0[235][03456789]\d7$/,
        min: 10,
        max: 10
      },
      password: {
        type: 'string',
        empty: false,
        min: 6,
        max: 255
      },
      confirm_password: {
        type: 'custom',
        empty: true,
        matched: req.body.password,
        passwordField: 'password',
        check(value, errors, schema) {
          if(value !== schema.matched) errors.push({
            type: 'confirmPassword',
            expected: schema.matched,
            actual: value
          });

          return value
        }
      }
    };

    try {
      const validated = req.validate(validationSchema);

      if(validated !== true) next({
        name: 'requestValidationError',
        notifyTypes: [ 'Invalid Form Data' ],
        errors: validated
      });
      else {
        const passwordHash = cryptoService.makeHash(req.body.password);
        const clientRoleDbInstance = await models.Role.findOne({ where: { name: 'Client' } });

        const newUserDbInstance = await models.User.create({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          other_names: req.body.other_names,
          email: req.body.email,
          username: req.body.username,
          phone_number: req.body.phone_number,
          hash: passwordHash.hash,
          salt: passwordHash.salt
        });

        await newUserDbInstance.addRole(clientRoleDbInstance);

        res.status(201).send({
          notifications: [ req.notify('Registration Successful', `Welcome, ${newUserDbInstance.first_name} ${newUserDbInstance.last_name}.`) ],
          user: await newUserDbInstance.getSafeDataForFrontend(),
          token: await jwtService.generateFullToken(newUserDbInstance)
        })
      }
    } catch (error) {
      next({ 
        ...error,
        notifyTypes: [ error.name == 'SequelizeUniqueConstraintError' ? 'Server Unique Constraint Error' : 'Server Error' ], 
      })
    }
  }

  return [ firstStep ]
}

function user() {
  async function firstStep(req, res, next) {
    res.send({ user: await req.user.getSafeDataForFrontend() })
  }

  return [
    ...checkAuthGuardMiddleware(),
    firstStep
  ]
}

function refresh() {
  async function firstStep(req, res, next) {
    const validationSchema = {
      refresh_token: {
        type: 'string',
        empty: false
      }
    };

    try {
      const validated = req.validate(validationSchema);

      if(validated !== true) next({
        name: 'requestValidationError',
        notifyTypes: [ 'Invalid Refresh Token' ],
        errors: validated
      });
      else {
        const refreshTokenDbInstance = await jwtService.verifyRefreshToken(req.body.refresh_token);

        if(!refreshTokenDbInstance) next({
          name: 'authorizationError',
          notifyTypes: [ 'Authorization Error' ]
        });
        else {
          const userDbInstance = await refreshTokenDbInstance.getUser();
          res.send(await jwtService.generateAccessToken(userDbInstance));
        }
      }
    } catch (error) {
      next({ 
        ...error,
        notifyTypes: [ 'Server Error' ]
      })
    }
  }

  return [ firstStep ]
}

module.exports = {
  login,
  logout,
  register,
  user,
  refresh
}