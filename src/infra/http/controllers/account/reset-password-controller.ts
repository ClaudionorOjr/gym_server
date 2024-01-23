import { ResetPasswordUseCase } from '@account/application/use-cases/reset-password'
import { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { JsonWebTokenError } from 'jsonwebtoken'
import { z } from 'zod'

export async function resetPassword(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const resetPasswordQuerySchema = z.object({
    token: z.string(),
  })

  const resetPasswordBodySchema = z.object({
    password: z.string().min(6),
  })

  const { token } = resetPasswordQuerySchema.parse(request.query)
  const { password } = resetPasswordBodySchema.parse(request.body)

  try {
    const resetPasswordUseCase = container.resolve(ResetPasswordUseCase)

    const result = await resetPasswordUseCase.execute({
      token,
      password,
    })

    if (result.isFailure()) {
      throw result.value
    }

    return reply.status(204).send()
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      console.log(error)
      return reply.status(400).send({ message: error.message })
    }

    throw error
  }
}
