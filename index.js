const bodyParser  = require( 'body-parser' ),
      cluster     = require( 'cluster' ),
      numCPUs     = require( 'os' ).cpus().length,
      compression = require( 'compression' ),
      config      = require( './config' ),
      express     = require( 'express' ),
      mongoose    = require( 'mongoose' ),
      morgan      = require( 'morgan' ),
      path        = require( 'path' ),
      rfs         = require( 'rotating-file-stream' ),
      routes      = require( './routes' ),
      logger      = require( './util/logger' );

if ( cluster.isMaster ) {
  logger.log( `Master ${process.pid} is running` );

  // Fork workers.
  for ( let i = 0; i < numCPUs; i++ ) {
    cluster.fork();
  }

  cluster.on( 'exit', ( worker, code, signal ) => {
    logger.log( `Worker ${worker.process.pid} died` );
  } );

} else {
  const fs     = require( 'fs' ),
        logDir = path.join( __dirname, config.logDir );


  // Check for 'logs' directory
  fs.access( logDir, ( err ) => {
    if ( err ) {
      fs.mkdirSync( logDir );
    }
  } );

  mongoose.Promise = global.Promise;
  mongoose.connect( config.dbUrl, {
    useMongoClient : true,
    autoReconnect  : true
  }, ( err ) => {
    if ( err ) {
      throw err;
    }
    logger.log( 'Database connection successful' );

    // Initialize express instance, and log rotation
    let app             = express(),
        accessLogStream = rfs( 'access.log', {
          interval : '1d',
          path     : logDir
        } );

    // Setup views and pathing
    app.set( 'view engine', config.viewEngine );
    app.set( 'views', path.join( __dirname, 'public' ) );

    // Serve static content
    app.use( express.static( path.join( __dirname, 'public' ) ) );

    // Set up middleware
    app.use( morgan( 'dev', { stream : accessLogStream } ) );
    app.use( compression() );
    app.use( bodyParser.urlencoded( {
      extended : false,
      limit    : '20mb'
    } ) );
    app.use( bodyParser.json( { limit : '20mb' } ) );

    // Pass app to routes
    routes( app );

    // Start application
    app.listen( config.port, () => {
      logger.log( `Worker ${process.pid} started, express running on port ${config.port}` );
    } );
  } );
}
