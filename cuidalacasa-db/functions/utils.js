const SimpleNodeLogger = require('simple-node-logger'),
  opts = {
    /* logFilePath:'mylogfile.log', */
    timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS'
  };
const logger = SimpleNodeLogger.createSimpleLogger( opts);

module.exports = { logger };