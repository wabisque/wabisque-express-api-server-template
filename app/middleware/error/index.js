function error(err, req, res, next) {
  //TODO:: This should see some change.
  const group1 = [ 'requestValidationError' ];
  const group2 = [ 'SequelizeUniqueConstraintError' ];
  const group3 = [ 'authenticationError' ];
  const group4 = [ 'authorizationError' ];

  let status = 500;
  let formErrors = [];
  let notifications = [ req.notify('Server Error', 'The server seems unresponsive.', 'danger') ];

  if(!!err.data) {
    if(group1.includes(err.data.name)) {
      status = 422;
      notifications = err.notifications;
      formErrors = err.data.errors
    } else if(group2.includes(err.data.name)) {
      status = 409;
      notifications = [ req.notify('Unique Constraint Error', 'There is a unique contraint server error. Please correct any errors associated with any fields.', 'danger') ];
      err.data.errors.forEach(formErr => {
        formErrors.push({
          type: formErr.type,
          message: formErr.message,
          field: formErr.path,
          actual: formErr.value
        })
      })
    } else if(group3.includes(err.data.name)) {
      status = 401;
      notifications = err.notifications;
    } else if(group4.includes(err.data.name)) {
      status = 403;
      notifications = err.notifications;
    }

    res.status(status).send({ notifications: notifications, formErrors: formErrors })
  } else {
    res.status(500).send(err)
  }
}

function exec(app) {
  app.use(error)
}

module.exports = exec