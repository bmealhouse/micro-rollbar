const micro = require('micro')
const nock = require('nock')
const fetch = require('node-fetch')
const Rollbar = require('rollbar')
const listen = require('test-listen')
const middleware = require('./')

const ROLLBAR_HOST = 'https://api.rollbar.com'

const {createError, send} = micro
const errorHandler = middleware(Rollbar)({accessToken: 'token'})

const getServer = fn => micro(errorHandler(fn))

test('200: success', () => {
  expect.assertions(1)

  const fn = (req, res) =>
    new Promise(resolve => {
      return resolve(send(res, 200, {body: 'success'}))
    })

  const server = getServer(fn)
  return listen(server)
    .then(url => fetch(url))
    .then(res => res.json())
    .then(data => {
      expect(data).toEqual({body: 'success'})
      server.close()
    })
})

test('400: throw micro error', () => {
  expect.assertions(1)

  nock(ROLLBAR_HOST).post('/api/1/item/').reply(200, {
    result: 'success'
  })

  const fn = () =>
    new Promise(() => {
      throw createError(400, 'Bad Request')
    })

  const server = getServer(fn)
  return listen(server).then(url => fetch(url)).then(res => {
    expect(res.status).toBe(400)
    server.close()
  })
})

test('500: throw regular error', () => {
  expect.assertions(1)

  nock(ROLLBAR_HOST).post('/api/1/item/').reply(200, {
    result: 'success'
  })

  const fn = () =>
    new Promise(() => {
      throw new Error('ERROR')
    })

  const server = getServer(fn)
  return listen(server).then(url => fetch(url)).then(res => {
    expect(res.status).toBe(500)
    server.close()
  })
})

test('500: throw plain object', () => {
  expect.assertions(1)

  nock(ROLLBAR_HOST).post('/api/1/item/').reply(200, {
    result: 'success'
  })

  const fn = () =>
    new Promise(() => {
      // eslint-disable-next-line no-throw-literal
      throw {statusCode: 500}
    })

  const server = getServer(fn)
  return listen(server).then(url => fetch(url)).then(res => {
    expect(res.status).toBe(500)
    server.close()
  })
})

test('500: rollbar error', () => {
  expect.assertions(1)

  nock(ROLLBAR_HOST).post('/api/1/item/').replyWithError('ROLLBAR ERROR')

  const fn = () =>
    new Promise(() => {
      throw createError(500, 'Internal Server Error')
    })

  const server = getServer(fn)
  return listen(server).then(url => fetch(url)).then(res => {
    expect(res.status).toBe(500)
    server.close()
  })
})
