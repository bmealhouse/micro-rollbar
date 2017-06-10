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

const errorHandler = microRollbar('ROLLBAR_ACCESS_TOKEN')

module.exports = errorHandler(async (req, res) => {
  throw createError(500, 'Reported to rollbar')
})
```

Using the global error handler with additional options:

```js
const {send} = require('micro')
const microRollbar = require('micro-rollbar')
const Rollbar = require('rollbar')

// See all available options here:
// https://github.com/rollbar/rollbar.js#server-configuration
const errorHandler = microRollbar('ROLLBAR_ACCESS_TOKEN', {
  environment: process.env.NODE_ENV || 'development'
})

module.exports = errorHandler(async (req, res) => {
  Rollbar.info('Reported to rollbar')

  // If you are also using the rollbar package, ensure that Rollbar.wait()
  // is called before sending your response.
  Rollbar.wait(() => {
    send(res, 200, 'Ready!')
  })
})
```
