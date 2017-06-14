const Rollbar = require('rollbar')

function log(level, args) {
  if (process.env.NODE_ENV === 'production') {
    console.log(`${level}:`, args[0])
  }

  return new Promise(resolve => {
    Rollbar[level](...args, (err, res) => {
      if (err) {
        console.log(`Rollbar error, ignoring: ${err}`)
      }
      resolve(res)
    })
  })
}

exports.debug = (...args) => log('debug', args)
exports.info = (...args) => log('info', args)
exports.warning = (...args) => log('warning', args)
exports.error = (...args) => log('error', args)
exports.critical = (...args) => log('critical', args)
