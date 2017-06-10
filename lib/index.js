const {send} = require('micro')

module.exports = Rollbar => options => {
  const defaults = {
    environment: process.env.NODE_ENV || 'development',
    handleUncaughtExceptions: true,
    handleUnhandledRejections: true
  }

  const rollbar = Rollbar.init(Object.assign({}, defaults, options))

  return fn => (req, res) =>
    fn(req, res).catch(err => {
      const {statusCode = 500, message = 'Internal Server Error'} = err
      const error = err instanceof Error ? err : `Error: ${JSON.stringify(err)}`

      const cb = rollbarErr => {
        if (rollbarErr) {
          console.log(`Rollbar error, ignoring: ${rollbarErr}`)
        }

        send(res, statusCode, message)
      }

      if (process.env.NODE_ENV === 'production') {
        console.error(error)
      }

      rollbar.error(error, req, cb)
    })
}
