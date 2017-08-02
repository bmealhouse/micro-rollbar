# micro-rollbar

[![Build Status](https://travis-ci.org/bmealhouse/micro-rollbar.svg?branch=master)](https://travis-ci.org/bmealhouse/micro-rollbar)
[![Greenkeeper badge](https://badges.greenkeeper.io/bmealhouse/micro-rollbar.svg)](https://greenkeeper.io/)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

> Rollbar error handler for Zeit's [Micro](https://github.com/zeit/micro)

## Installation

```sh
npm install --save micro-rollbar
```

## Usage

Using the global error handler:

```js
const {createError} = require('micro')
const microRollbar = require('micro-rollbar')

const errorHandler = microRollbar({
  accessToken: 'ROLLBAR_ACCESS_TOKEN'
})

module.exports = errorHandler(async (req, res) => {
  throw createError(500, 'Reported to rollbar')
})
```

Using the global error handler with additional options:

```js
const {send} = require('micro')
const microRollbar = require('micro-rollbar')
const {debug, info, warning, error, critical} = microRollbar

// See Rollbar documentation for available options.
// https://rollbar.com/docs/notifier/rollbar.js/#standalone
const errorHandler = microRollbar({
  accessToken: 'ROLLBAR_ACCESS_TOKEN',
  environment: process.env.NODE_ENV || 'development',
  host: 'app.domain.com',
  enabled: process.env.NODE_ENV !== 'test'
})

module.exports = errorHandler(async (req, res) => {
  await info('Reported to rollbar')
  send(res, 200, 'Ready!')
})
```

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars0.githubusercontent.com/u/3741255?v=3" width="100px;"/><br /><sub>Brent Mealhouse</sub>](https://twitter.com/bmealhouse)<br />[💻](https://github.com/bmealhouse/micro-rollbar/commits?author=bmealhouse "Code") [📖](https://github.com/bmealhouse/micro-rollbar/commits?author=bmealhouse "Documentation") [⚠️](https://github.com/bmealhouse/micro-rollbar/commits?author=bmealhouse "Tests") |
| :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!

## Contributing

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device
2. Install the dependencies: `yarn`
3. Link the package to the global module directory: `yarn link`
4. Run `yarn test -- --watch` and start making your changes
5. You can use `yarn link micro-rollbar` to test your changes in an actual project

## LICENSE

MIT
