import Fastify from 'fastify'
import { Examination, ExamMap, Test, TestMap, User } from '../../shared/types'
import jsonfile from 'jsonfile'
import fastifyCookie from '@fastify/cookie'
import fastifyFormBody from '@fastify/formbody'
import fastifyAuth from '@fastify/auth'
import fastifyStatic from '@fastify/static'
import { OAuth2Client } from 'google-auth-library'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { getSlug } from '../../shared/utils'
import path from 'path'
import { fileURLToPath } from 'url'


const port = Number(process.env.PORT) || 3000
const jwtSecret = process.env.JWT_SECRET

if (!jwtSecret) {
  throw new Error('Missing env JWT_SECRET')
}

const client_id = process.env.GOOGLE_AUTH_CLIENT_ID

if (!client_id) {
  throw new Error('Missing env GOOGLE_AUTH_CLIENT_ID')
}

let allowedUsers: User[] = []

try {
  allowedUsers = jsonfile.readFileSync('./users.json')
} catch (err) {
  console.log('ERR when reading users.json', {err})
}

declare module 'fastify' {
  export interface FastifyRequest {
    user?: JwtPayload,
  }
}

const oauthClient = new OAuth2Client(client_id)

const app = Fastify({
  logger: true,
})

let exams: ExamMap
let tests: TestMap

jsonfile.readFile('data.json')
  .then((data: {exams: ExamMap, tests: TestMap}) => {
    ({ exams, tests } = data)
  })
  .catch((err: Error) => {
    console.error('failed to read data.json', err)
    exams = {}
    tests = {}
  })

setInterval(() => {
  jsonfile.writeFile('data.json', { exams, tests })
}, 5 * 60 * 1000)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  prefix: '/',
})

app.register(fastifyCookie)
app.register(fastifyFormBody)

const publicURLs = [
  '/',
  '/auth',
  '/callback',
]

app.register(fastifyAuth)
  .after(() => {
    app.addHook('preHandler', app.auth([
      (req, rep, done) => {
        jwt.verify(req.cookies.token as string, jwtSecret, (err, user) => {
          req.user = user as JwtPayload

          if (publicURLs.some(pu => req.url.startsWith(pu))) {
            done()
            return
          }

          done(err as Error)
        })
      }
    ]))
  })

app.get<{
  Reply: ExamMap,
}>('/api/exams', (request, reply) => {
  reply.send(exams)
})

app.post<{
  Body: Omit<Examination, 'id'>,
}>('/api/exams', (req, res) => {
  const b = req.body
  const id: Examination['id'] = getSlug(b.name)

  if (exams[id]) {
    res
      .status(400)
      .send({
        error: 'entity exists',
      })

      return
  }

  exams[id] = {
    ...b,
    id,
  }

  res.send({})
})

app.put<{
  Params: {
    id: Examination['id'],
  },
  Body: Examination,
}>('/api/exams/:id', (req, res) => {
  const b = req.body
  const id = req.params.id

  if (!exams[id]) {
    res
      .status(404)
      .send({
        error: 'entity not found',
      })

      return
  }

  exams[id] = {
    ...b,
    id,
  }

  res.send({})
})

app.delete<{
  Params: {
    id: Examination['id'],
  },
}>('/api/exams/:id', (req, reply) => {
  const id = req.params.id

  delete exams[id]
  reply.send({})
})

app.get<{
  Reply: TestMap,
}>('/api/tests', (req, res) => {
  res.send(tests)
})

app.post<{
  Body: Omit<Test, 'id'>,
}>('/api/tests', (req, res) => {
  const b = req.body
  const id: Test['id'] = getSlug(b.label)

  if (tests[id]) {
    res
      .status(400)
      .send({
        error: 'entity exists',
      })

      return
  }

  tests[id] = {
    ...b,
    id,
  }

  res.send({})
})

app.delete<{
  Params: {
    id: Test['id'],
  },
}>('/api/tests/:id', (req, res) => {
  const id = req.params.id

  const isUsed = Boolean(
    Object.values(exams)
      .find(e => e.testList.includes(id))
  )

  if (isUsed) {
    res
      .status(400)
      .send({
        error: 'entity in use',
      })

      return
  }

  delete exams[id]
  res.send({})
})

app.get('/api/me', (req, res) => {
  res.send(req.user)
})

app.post<{
  Body: {
    login?: string,
    password?: string,
  },
}>('/auth', async (request, reply) => {
  const b = request.body

  if (!b.login || !b.password) {
    reply.status(400).send('missing credential')
    return
  }

  const user = allowedUsers.find(au =>
    au.email === b.login &&
    au.password === b.password
  )

  if (!user) {
    reply.status(401).send('unauthorised')
    return
  }

  const token = jwt.sign({
    email: user.email,
    isAdmin: user.isAdmin,
  }, jwtSecret)

  reply
    .setCookie('token', token, {
      httpOnly: true,
      secure: true,
      maxAge: 3600 * 20,
    })
    .send({success: true})

  return
})

app.post<{
  Body: {
    g_csrf_token?: string,
    credential?: string,
  },
}>('/callback', async (request, reply) => {
  if (!request.cookies.g_csrf_token ||
    !request.body.g_csrf_token ||
    request.cookies.g_csrf_token !== request.body.g_csrf_token
  ) {
    reply.redirect(302, '/')
    return
  }

  const ticket = await oauthClient.verifyIdToken({
    idToken: request.body.credential as string,
    audience: client_id,
  });

  const payload = ticket.getPayload();
  const email = payload?.email;
  const token = jwt.sign({email}, jwtSecret)

  reply
    .setCookie('token', token, {
      httpOnly: true,
      secure: true,
      maxAge: 3600 * 20,
    })
    .redirect(302, '/')

  return
})

app.get('/logout', (req, res) => {
  res
    .setCookie('token', '')
    .redirect(302, '/')
})


const start = async () => {
  try {
    await app.listen({ host: '0.0.0.0', port })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
