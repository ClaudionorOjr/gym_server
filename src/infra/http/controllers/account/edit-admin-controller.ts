import { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'

import { EditAdminUseCase } from '@account/application/use-cases/edit-admin'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'

import { z } from 'zod'

export async function editAdmin(request: FastifyRequest, reply: FastifyReply) {
  const editAdminBodySchema = z.object({
    completeName: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
  })

  const { sub } = request.user

  const { completeName, email, phone } = editAdminBodySchema.parse(request.body)

  try {
    const editAdminUseCase = container.resolve(EditAdminUseCase)

    const result = await editAdminUseCase.execute({
      adminId: sub,
      completeName,
      email,
      phone,
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
