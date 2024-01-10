import 'reflect-metadata'
import fastify from 'fastify'
import { routes } from './infra/http/routes'
import { ZodError } from 'zod'
import { env } from './infra/env'
import '@infra/container'

export const app = fastify()

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

  return reply.status(500).send({ message: 'Internal server error' })
})
