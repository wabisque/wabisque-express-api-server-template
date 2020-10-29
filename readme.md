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

* The final section of the “index.js” file is the initialization of the server. This is the section where the server is started or ran. This is what is looks like:

```js
// initialization of the express server app.
app.listen(process.env.SERVER_PORT, function (error) {
  if(error) return console.log('ERROR', error);

  console.log('\x1b[0m %s\x1b[36m %s\x1b[0m','\n *** server running on', `http://localhost:${process.env.SERVER_PORT}`, '***\n')
});
```

With the “index.js” file out of the way, let’s try and understand the other files that back it up. I’ve gathered those files into various folders that exist in the “app” folder. The image below demonstrates how the “app” folder is structured:

![overview-7](./documents/images/overview-7.png)

I’d be giving a brief summary of purpose for each of the folders in the `app` folder:

*	**config** – Holds various config files that are relied upon by several functions of the app.
*	**controllers** – Holds all controller that are used to control the behavior of requests made to routes specified in the `routes` folder.
*	**database** – Holds all database related files – migrations, models, seeders and development SQLite databases.
*	**keys** – Holds all sha512 keys for JWT verification.
*	**middleware** – Holds all middleware needed for request checks.
*	**routes** – Holds all files that specify the routes by which the server can be consumed.
*	**services** – Holds all functionalities created using unrelated dependencies.

### Starting Dependencies of the Project

This project come with a list of starting dependencies installable through NPM. This, however, doesn’t imply that you can use your own dependencies – bear in mind that this project is a template; its is made to be built upon. Here is the list of starting dependencies and what they do in no particular order:

*	**cors** – This helps protect the server from request made from untrusted sources.
*	**crypto** – This helps generate hashes for raw text and also verify those generated hashes against text. This is very useful for hashing passwords.
*	**dotenv** – This allows us to use variables specified in a `.env` file at the root folder of the project in any other JavaScript file through the globally available `process.env` object.
*	**express** – This is what the server is built with.
*	**fastest-validator** – This provides functionality for validating request data. I created a service using this dependency specifically for validating the body of any request – similar to `$request→validate` in the Laravel framework.
*	**jsonwebtoken** – This helps generate and verify JWTs (Json Web Tokens). This is very useful for JWT authentication.
*	**moment** – This provides functionality for working with date and time values.
*	**passport** – This allows us to authenticate users.
*	**passport-jwt** – This is used by the `passport` dependency to allow us to authenticate users using JWTs.
*	**sequelize** – This is an ORM (Object Relational Mapper) for databases. It is similar to `eloquent` in the Laravel framework.

The following dependencies are only useful in the development stage and would be taken out at the production stage:

*	**morgan** – This allow us to log HTTP (Hypertext Transfer Protocol) request and response to the console or the working terminal.
*	**nodemon** – This allows us to automatically restart the server if running when there has been a change in the files of the project.
*	**sqlite3** – This allows us to create `sqlite3` connections using the `sequelize` dependency.
*	**sequelize-cli** – This allows us to create database migrations, models, and seeders using the terminal. It behaves like `artisan` in the Laravel framework.

## ENV Variables

ENV or `environment` variables are variable needed by the current project environment – which could be `development`, `testing` or `production` to run. All ENV variables are declared and used manually, meaning, you can create your very own ENV variables. To use any ENV variables, you’d need to install the `dotenv` package – not to worry, this dependency should be already installed by this point. The following are steps you can take to create and use your own ENV variables, assuming the `dotenv` dependency is already installed:

* Create a `.env` file at the root folder of the project as demonstrated by the image below.

![env-1](./documents/images/env-1.png)

* Declare your ENV variable – for this example our variable is going to be `DEV_AGE`. Please note that ENV variables should be declared in uppercase snake-case. The image below demonstrates this step.

```
DEV_AGE=21
```

* Import the `dotenv` dependency into the target file, configure the `dotenv` file by calling its `config` method, and access your variable through `process.env`. The image below demonstrates this step – I’ll log the value of our ENV variable to the console.

```js
const dotenv = require('dotenv');

dotenv.config();

console.log('The value of my ENV variable is:', process.end.DEV_AGE);
```

Below is the result when the target file is run.

```
The value of my ENV variable is: 21
```

There is a `.env.example` file in the root folder of the project which you must copy as a basis for a `.env` file in none exists. The contents of the `.env.example` file are as follows.

```
NODE_ENV=development

DB_DIALECT=mysql
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_DATABASE=my_db

SERVER_PORT=8181
```

And their uses are as follows:

* **NODE_ENV**: Specifies what environment the app should be running in. Change its value to `production` upon deployment of the server, and to `testing` upon testing the server.
*	**All DB_ variables**: All ENV variables prefixed with `DB_` are credentials needed for a database connection.
     * **DIALECT**: The type of database in use – examples could be SQLite, MySQL, Postgres and the likes.
    *	**HOST**: The host URL of the database server.
    *	**USER**: The username of the user trying to access the database server.
    *	**PASSWORD**: The password of the user trying to access the database server.
    *	**DATABASE**: The database to be utilized by the server.
*	**SERVER_PORT**: The port number at which the server listens to requests. Leave this variable blank if you’d like to use the default port number.
