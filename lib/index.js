const {send} = require('micro')
const Rollbar = require('rollbar')
const logger = require('./logger')

function microRollbar(options) {
  const defaults = {
    environment: process.env.NODE_ENV || 'development',
    handleUncaughtExceptions: true,
    handleUnhandledRejections: true
  }

  Rollbar.init(Object.assign({}, defaults, options))

  return fn => (req, res) =>
    fn(req, res).catch(err => {
      const {statusCode = 500, message = 'Internal Server Error'} = err
      const error = err instanceof Error ? err : `Error: ${JSON.stringify(err)}`

      return logger.error(error, req).then(() => {
        send(res, statusCode, message)
      })
    })
}

microRollbar.debug = logger.debug
microRollbar.info = logger.info
microRollbar.warning = logger.warning
microRollbar.error = logger.error
microRollbar.critical = logger.critical

module.exports = microRollbar
