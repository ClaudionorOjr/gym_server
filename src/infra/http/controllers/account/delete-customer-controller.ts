import { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'

import { DeleteCustomerUseCase } from '@account/application/use-cases/delete-customer'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { z } from 'zod'

export async function deleteCustomer(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteCustomerParamsSchema = z.object({
    customerId: z.string().uuid(),
  })

  const { customerId } = deleteCustomerParamsSchema.parse(request.params)

  try {
    const deleteCustomerUseCase = container.resolve(DeleteCustomerUseCase)

    const result = await deleteCustomerUseCase.execute({ customerId })

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
