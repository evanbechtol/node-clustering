const cluster = require( "cluster" );
const config = require( "./config" );
const logger = require( "./services/Logger" );

if ( cluster.isMaster ) {
  logger.info( `Master ${process.pid} is running` );

  // Fork workers.
  for ( let i = 0; i < config.numChildren; i++ ) {
    cluster.fork();
  }

  cluster.on( "exit", ( worker, code, signal ) => {
    logger.info( `Worker ${worker.process.pid} died` );
  } );

} else {
  const config = require( "./config" );
  const mongoose = require( "mongoose" );
  const logger = require( "./services/Logger" );

  const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  };

  mongoose.Promise = global.Promise;

// Connect to the DB an initialize the app if successful
  mongoose.connect( config.dbUrl, mongooseOptions )
    .then( () => {
      logger.info( "Database connection successful" );

      // Create express instance to setup API
      const ExpressLoader = require( "./loaders/Express" );
      new ExpressLoader();
    } )
    .catch( err => {
      //eslint-disable-next-line
      console.error( err );
      logger.error( err );
    } );
}
