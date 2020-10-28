const models = require('../../database/models');

function exec(app) {
  function error(err, req, res, next) {
    //TODO:: This should see some change.
    const responseData = {};
    let status = 500;

    if(!!err.name) {
      switch (err.name) {
        case 'requestValidationError':
          status = 422;

          if(!!err.errors) responseData.formErrors = err.errors;
          break;
        
        case 'SequelizeUniqueConstraintError':
          if(!!err.errors) {
            const identifierOptions = [ 'email', 'username' ];
  
            responseData.formErrors = [];
  
            err.errors.forEach(function(formError) {
              responseData.formErrors.push({
                type: formError.type,
                message: (identifierOptions.includes(formError.path) && formError.type == 'unique violation' && formError.instance instanceof models.User) ? `The '${formError.path}' already belongs to another user.` : formError.message,
                field: formError.path,
                actual: formError.value
              })
            })
          }
          break;

        case 'authenticationError':
          status = 401;

          if(!!err.errors) responseData.formErrors = err.errors;
          break;

        case 'authorizationError':
          status = 403;

          if(!!err.errors) responseData.formErrors = err.errors;
          break;
      }
    }

    if(!!err.notifyTypes && Array.isArray(err.notifyTypes) && err.notifyTypes.length > 0) {
      responseData.notifications = [];

      err.notifyTypes.forEach(function (notifyType) {
        let message;
        switch (notifyType) {
          case 'Server Error':
            message = 'The server seems to be down at the moment';
            break;

          case 'Server Unique Constraint Error':
            message = 'The has been a unique constraint violation in the server. Please correct any errors associated with any fields.';
            break;

          case 'Authorization Error':
            message = 'You are not authorized to access this resource.';
            break;

          case 'Inconsistent Credentials':
            message = 'The provided credentials do not match any account in our records.';
            break;

          case 'Unknown Credentials':
            message = 'There is no registered account with these credentials in our records.';
            break;

          case 'Invalid Credentials':
            message = 'The provided credentials are invalid. Please correct any errors associated with any fields.';
            break;

          case 'Invalid Refresh Token':
            message = 'The provided refresh token is invalid. Please provide a valid one.';
            break;

          case 'Invalid Form Data':
            message = 'The provided form data is invalid. Please correct any errors associated with any form fields.';
            break;
        }

        if(!!message) responseData.notifications.push(req.notify(notifyType, message, 'danger'))
      });

      if(responseData.notifications.length == 0) delete responseData.notifications
    }

    res.status(status).send(responseData)
  }

  const middleware = [ error ];

  app.use(...middleware)
}

module.exports = exec