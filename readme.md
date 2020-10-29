# wabisque-express-api-server-template

## Overview

This project is an API template made with express for full stack web developer who want to build both frontend and backend with JavaScript. 

### Initializing the Project

This project requires that you have already installed node and have NPM (Node Package Manager) working.

* To start this project, you’d first have to clone this projects repository using the link below  
[clone the project](https://github.com/wabisque/wabisque-express-api-server-template.git),  
or download the project files using the link below  
[download project as zip](https://github.com/wabisque/wabisque-express-api-server-template/archive/main.zip).
* Open the project folder in an IDE (Integrated Development Environment) of your choosing – I personally use `Visual Studio Code`.
* Open the integrated terminal of the IDE or any other terminal of your choosing, navigate to the project folder’s directory and type in the command below – the working directory of the integrated terminal would be automatically set to the root directory of the project.  
All dependencies of the project would be install – to see all the dependencies of the project, open the `package.json` file at the root folder of the project. Furthermore, note that this step is interchangeable with the previous.

```
npm i
```

* The project is finally setup. You can run the following command in your terminal to start the server.

```
npm run dev
```

### Project Layout

The project has only one file, `index.js` which is located at its root folder. The contents of are structured in a readable manner with comments to show what each line of code does. You’ll, in most cases not alter the contents of this file, except for cases where you’d want to initialize a new service \[more on services later\], or cases where you’d like to remove or comment out development lines. Anyway, without further ado, I’ll discuss the contents of the `index.js` file.

* The first section of the `index.js` file are the import statements. This is what these statements look like:

```js
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
```

If you look closely, you’d be able to find some development lines – lines of code that should be removed during production.

* The second section is the setup section. It is where we setup ENV variables \[more on ENV variables later\], the server, and services. This is what is looks like:

```js
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
```

Again, there are some development lines of code in this section.

* The third section is the registration section. It is where the core and error middleware \[more on middleware later\], as well as, routes \[more on routes later\] are registered. This is what this section looks like:

```js
// registration for core middleware.
coreMiddleware(app);

// registration for routes.
routes(app);

//registration for error middleware
errorMiddleware(app);
```
