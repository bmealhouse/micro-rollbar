const micro = require('micro')
const nock = require('nock')
const fetch = require('node-fetch')
const listen = require('test-listen')
const middleware = require('./')

const ROLLBAR_HOST = 'https://api.rollbar.com'

const {send} = micro
const errorHandler = middleware({accessToken: 'token'})
const {debug, info, warning, error, critical} = middleware

const getServer = fn => micro(errorHandler(fn))

test('200: debug', () => {
  expect.assertions(1)

  nock(ROLLBAR_HOST).post('/api/1/item/').reply(200, {
    result: 'success'
  })

  const fn = (req, res) =>
    new Promise(resolve => {
      debug('debug').then(() => resolve(send(res, 200)))
    })

  const server = getServer(fn)
  return listen(server).then(url => fetch(url)).then(res => {
    expect(res.status).toBe(200)
    server.close()
  })
})

test('200: info', () => {
  expect.assertions(1)

  nock(ROLLBAR_HOST).post('/api/1/item/').reply(200, {
    result: 'success'
  })

  const fn = (req, res) =>
    new Promise(resolve => {
      info('info').then(() => resolve(send(res, 200)))
    })

  const server = getServer(fn)
  return listen(server).then(url => fetch(url)).then(res => {
    expect(res.status).toBe(200)
    server.close()
  })
})

test('200: warning', () => {
  expect.assertions(1)

  nock(ROLLBAR_HOST).post('/api/1/item/').reply(200, {
    result: 'success'
  })

  const fn = (req, res) =>
    new Promise(resolve => {
      warning('warning').then(() => resolve(send(res, 200)))
    })

  const server = getServer(fn)
  return listen(server).then(url => fetch(url)).then(res => {
    expect(res.status).toBe(200)
    server.close()
  })
})

test('200: error', () => {
  expect.assertions(1)

  nock(ROLLBAR_HOST).post('/api/1/item/').reply(200, {
    result: 'success'
  })

  const fn = (req, res) =>
    new Promise(resolve => {
      error('error').then(() => resolve(send(res, 200)))
    })

  const server = getServer(fn)
  return listen(server).then(url => fetch(url)).then(res => {
    expect(res.status).toBe(200)
    server.close()
  })
})

test('200: critical', () => {
  expect.assertions(1)

  nock(ROLLBAR_HOST).post('/api/1/item/').reply(200, {
    result: 'success'
  })

  const fn = (req, res) =>
    new Promise(resolve => {
      critical('critical').then(() => resolve(send(res, 200)))
    })

  const server = getServer(fn)
  return listen(server).then(url => fetch(url)).then(res => {
    expect(res.status).toBe(200)
    server.close()
  })
})
