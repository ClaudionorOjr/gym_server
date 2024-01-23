import { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { ForgotPasswordUseCase } from '@account/application/use-cases/forgot-password'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { z } from 'zod'

export async function forgotPassword(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const forgotPasswordBodySchema = z.object({
    email: z.string().email(),
  })

  const { email } = forgotPasswordBodySchema.parse(request.body)

  try {
    const forgotPasswordUseCase = container.resolve(ForgotPasswordUseCase)

    const result = await forgotPasswordUseCase.execute({
      email,
    })

    if (result.isFailure()) {
      throw result.value
    }

    return reply.status(204).send()
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}
