# Bare Express Web Server
A basic scaffold/skeleton to create a Node.JS Express server.

### Contributing
If you wish to contribute to this repository, please feel free to clone/fork.
Issue Pull Requests or open issues for any changes that you make.

### Functionality
* Service-based architecture
* HTTP(S) Request Logging
* Rotating log system
* Enforcement of HTTPS usage in production environments
* Compression of responses
* Configurable application variables
* REST-ful API setup

### Future Functionality
All future functionality will branch off of master; the master branch will always be
a simple "scaffold" express server. The other branches will contain additional functionality.

* MongoDB support: Connect and interact with Mongo DB's through [Mongoose](http://mongoosejs.com/)
* SQL DB support: Connect and interact with SQL DB's through [Sequelize](http://docs.sequelizejs.com/)
* Passport: Implement authentication and authorization strategies with [Passport](http://passportjs.org/) 

### Setup
- Simply clone the repo

- Install the dependencies 
   - Install [Node.JS](https://nodejs.org/en/)
   - Install application dependencies ```npm install```

- Add the routes you need under the `routes` directory, and include require them in your `routes/index.js` file.
```
| routes/
| index.js
|
|---> user/
     |---> index.js
|
|---> auth/
     |---> index.js
```

```
//FILE: routes/index.js
const routesTemplate = require( "./routes-template" );
const userRoutes = require( "./user" ); // Import your routes

let routes = ( app ) => {
  app.use( ( req, res, next ) => {
    res.setHeader( "Access-Control-Allow-Origin", "*" );
    res.setHeader( "Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE" );
    res.setHeader( "Access-Control-Allow-Headers", "X-Requested-With,content-type, x-access-token", "authorization" );
    res.setHeader( "Access-Control-Allow-Credentials", true );
    res.removeHeader( "X-Powered-By" );
    next();
  } );

  app.use( "/", routesTemplate );
  app.use( "/user", userRoutes ); // Add your routes like this
};

module.exports = routes;

```

### Application Structure
 - #### Config
     - Contains all application configurations parameters
 - #### Controllers
     - Handles calling of services that implement business logic, and responding to client requests. *Business logic should never be placed in a controller, always in a service!* 
 - #### Loaders
     - Loaders are responsible for bringing specific frameworks/modules into the application. This is neither business logic, nor does it handle requests explicitly.
 - #### Models
     - Models define the collection structure and allow for validation of data.
 - #### Routes
     - Routes define the REST interface and the API structure
 - #### Services
     - The services directory holds all services. These are intended to encapsulate and contain all business logic. This makes testing business logic much easier, and it is able to be re-used where needed
 
### Starting 
* Run the command ```npm test``` to run the application in "development" mode.
* Run the command ```npm start``` to run the application in "production" mode.
