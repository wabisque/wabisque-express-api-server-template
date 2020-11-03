const dotenv = require('dotenv');
const express = require('express');

// start:: Dev tools - These lines of code would be removed during production.
const morgan = require('morgan');
// end:: Dev tools

const jwtService = require('./app/services/jwt');
const passportService = require('./app/services/passport');

const coreMiddleware = require('./app/middleware/core');
const errorMiddleware = require('./app/middleware/error');

const routes = require('./app/routes');

// setup the .env file's variables to be accessed through `process.env`/
dotenv.config();

// creation of the express server app.
const app = express();

// start:: Dev tools - These lines of code would be removed during production.
app.use(morgan('dev'))
// end:: Dev tools

// initialization for services
jwtService.initialize();
passportService.initialize(app);

// registration for core middleware.
coreMiddleware(app);

// registration for routes.
routes(app);

//registration for error middleware
errorMiddleware(app);

// initialization of the express server app.
app.listen(process.env.PORT || 8081, function (error) {
  if(error) {
    console.log('ERROR', error);
    process.exit()
  }

  console.log('\x1b[0m %s\x1b[36m %s\x1b[0m','\n *** server running on', `http://localhost:${process.env.PORT || 8081}`, '***\n')
});