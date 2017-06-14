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
