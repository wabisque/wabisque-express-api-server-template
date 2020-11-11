const passport = require('passport');

function exec() {
  async function check(req, res, next) {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if(!!err) next(err);
      else {
        if(!user) next({ notifyTypes: [ 'Server Error' ] });
        else {
          req.user = user;
          next()
        }
      }
    })(req, res, next)
  }

  return [ check ]
}

module.exports = exec