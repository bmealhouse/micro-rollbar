const {send} = require('micro')
const Rollbar = require('rollbar')

module.exports = function(token, opts) {
  const defaultOptions = {
    accessToken: token,
    handleUncaughtExceptions: true,
    handleUnhandledRejections: true
  }

  const rollbar = new Rollbar(Object.assign(defaultOptions, opts))

  return fn => (req, res) =>
    fn(req, res).catch(err => {
      const {statusCode = 500, message = 'Internal Server Error'} = err

      const cb = rollbarErr => {
        if (rollbarErr) {
          console.log(`Rollbar error, ignoring: ${rollbarErr}`)
        }

        send(res, statusCode, message)
      }

      if (err instanceof Error) {
        rollbar.error(err, req, cb)
      } else {
        rollbar.error(`Error: ${JSON.stringify(err)}`, req, cb)
      }
    })
}
