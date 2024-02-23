import 'reflect-metadata'
import '@infra/container'
import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifyApiReference from '@scalar/fastify-api-reference'

import { routes } from './infra/http/routes'
import { env } from './infra/env'

import { ZodError } from 'zod'
import documentFile from './docs.json'

export const app = fastify()

const privateKey = env.JWT_PRIVATE_KEY
const publicKey = env.JWT_PUBLIC_KEY

// TODO: terminar as configurações do JWT, como cookies, expiração...
app.register(fastifyJwt, {
  secret: {
    private: Buffer.from(privateKey, 'base64'),
    public: Buffer.from(publicKey, 'base64'),
  },
  sign: {
    algorithm: 'RS256',
  },
})

/* DOCS */
app.register(fastifyApiReference, {
  routePrefix: '/docs',
  configuration: {
    spec: {
      content: documentFile,
    },
  },
})

/* ROUTES */
app.register(routes)

/* GLOBAL ERROR HANDLER */
app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error,', issues: error.format() })
  }

  // * Para que o Error Handler possa retornar os erros vindo do middleware verifyJWT
  if ('statusCode' in error) {
    return reply.send(error)
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
