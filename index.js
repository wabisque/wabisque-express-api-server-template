const dotenv = require('dotenv');
const express = require('express');

const coreMiddleware = require('./app/middleware/core');
const routes = require('./app/routes');
const errorMiddleware = require('./app/middleware/error');

// setup the .env file's variables to be accessed through `process.env`/
dotenv.config();

// creation of the express server app.
const app = express();

// registration for core middleware.
coreMiddleware(app);

// registration for routes.
routes(app);

//registration for error middleware
errorMiddleware(app);

// initializatin of the express server app.
app.listen(process.env.DEV_PORT, () => console.log('\x1b[0m %s\x1b[36m %s\x1b[0m','\n *** server running on', `http://localhost:${process.env.DEV_PORT}`, '***\n'));