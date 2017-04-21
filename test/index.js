const test = require('ava')
const micro = require('micro')
const nock = require('nock')
const fetch = require('node-fetch')
const listen = require('test-listen')
const middleware = require('../lib/index')

const ROLLBAR_HOST = 'https://api.rollbar.com'

const {createError, send} = micro
const errorHandler = middleware('token')

const getUrl = fn => {
  const server = micro(errorHandler(fn))
  return listen(server)
}

test.serial('200: success', async t => {
  const fn = async (req, res) => {
    send(res, 200, {body: 'success'})
  }

  const url = await getUrl(fn)
  const res = await fetch(url)
  const data = await res.json()

  t.deepEqual(data, {
    body: 'success'
  })
})

test.serial('400: throw micro error', async t => {
  nock(ROLLBAR_HOST).post('/api/1/item/').reply(200, {
    result: 'success'
  })

  const fn = async () => {
    throw createError(400, 'Bad Request')
  }

  const url = await getUrl(fn)
  const res = await fetch(url)

  t.deepEqual(res.status, 400)
})

test.serial('500: throw regular error', async t => {
  nock(ROLLBAR_HOST).post('/api/1/item/').reply(200, {
    result: 'success'
  })

  const fn = async () => {
    throw new Error('ERROR')
  }

  const url = await getUrl(fn)
  const res = await fetch(url)

  t.deepEqual(res.status, 500)
})

test.serial('500: throw plain object', async t => {
  nock(ROLLBAR_HOST).post('/api/1/item/').reply(200, {
    result: 'success'
  })

  const fn = async () => {
    // eslint-disable-next-line no-throw-literal
    throw {statusCode: 500}
  }

  const url = await getUrl(fn)
  const res = await fetch(url)

  t.deepEqual(res.status, 500)
})

test.serial('500: rollbar error', async t => {
  nock(ROLLBAR_HOST).post('/api/1/item/').replyWithError('ROLLBAR ERROR')

  const fn = async () => {
    throw createError(500, 'Internal Server Error')
  }

  const url = await getUrl(fn)
  const res = await fetch(url)

  t.deepEqual(res.status, 500)
})
