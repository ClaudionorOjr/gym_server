import { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'

import { ChangePasswordUseCase } from '@account/application/use-cases/change-password'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { WrongCredentialsError } from '@account/application/use-cases/errors/wrong-credentials-error'
import { z } from 'zod'

export async function changePassword(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const changePasswordBodySchema = z.object({
    password: z.coerce.string().min(6),
    newPassword: z.coerce.string().min(6),
  })

  const { password, newPassword } = changePasswordBodySchema.parse(request.body)
  const { sub } = request.user

  try {
    const changePasswordUseCase = container.resolve(ChangePasswordUseCase)

    const result = await changePasswordUseCase.execute({
      adminId: sub,
      password,
      newPassword,
    })

    if (result.isFailure()) {
      throw result.value
    }

    return reply.status(204).send()
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    if (error instanceof WrongCredentialsError) {
      return reply.status(401).send({ message: error.message })
    }

    throw error
  }
}
