const {send} = require('micro')
const rollbar = require('rollbar')

module.exports = function(token, opts) {
  rollbar.init(token, opts)

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
        rollbar.handleError(err, req, cb)
      } else {
        const message = `Error: ${JSON.stringify(err)}`
        rollbar.reportMessage(message, 'error', req, cb)
      }
    })
}
