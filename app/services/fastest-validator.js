const fastestValidator = require('fastest-validator');

const validator = new fastestValidator({
  useNewCustomCheckerFunction: true,
  messages: {
    confirmPassword: "The '{field}' field does not match the '{passwordField}' field.",
    fieldExistsInDb: "The '{field}' provided has already been taken"
  }
});

function validate(schema, data) {
  return validator.compile(schema)(data)
}

module.exports = {
  validate,
  validator
}