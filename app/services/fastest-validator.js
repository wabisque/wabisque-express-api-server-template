const fastestValidator = require('fastest-validator');

const validator = new fastestValidator({
  useNewCustomCheckerFunction: true,
  messages: { confirmPassword: "The '{field}' field does not match the 'password' field." }
});

function validate(schema, data) {
  return validator.compile(schema)(data)
}

module.exports = {
  validate,
  validator
}