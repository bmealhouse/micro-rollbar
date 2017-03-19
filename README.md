# micro-rollbar

[![Build Status](https://travis-ci.org/bmealhouse/micro-rollbar.svg?branch=master)](https://travis-ci.org/bmealhouse/micro-rollbar)
[![Greenkeeper badge](https://badges.greenkeeper.io/bmealhouse/micro-rollbar.svg)](https://greenkeeper.io/)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

> Rollbar error handler for Zeit's [Micro](https://github.com/zeit/micro)

## Installation
```shell
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
const rollbar = require('rollbar')

// See all available options here:
// https://github.com/rollbar/node_rollbar#configuration-reference
const errorHandler = microRollbar('ROLLBAR_ACCESS_TOKEN', {
  environment: process.env.NODE_ENV || 'development'
})

module.exports = errorHandler(async (req, res) => {
  rollbar.reportMessage('Reported to rollbar', 'info')

  // If you are also using the rollbar package, ensure that rollbar.wait()
  // is called before sending your response.
  rollbar.wait(() => {
    send(res, 200, 'Ready!')
  })
})
```
