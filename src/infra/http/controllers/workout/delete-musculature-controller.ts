import { FastifyRequest, FastifyReply } from 'fastify'
import { container } from 'tsyringe'
import { DeleteMusculatureUseCase } from '@workout/application/use-cases/delete-musculature'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { z } from 'zod'

export async function deleteMusculature(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteMusculatureParamsSchema = z.object({
    musculatureId: z.string().uuid(),
  })

  const { musculatureId } = deleteMusculatureParamsSchema.parse(request.params)

  try {
    const deleteMusculatureUseCase = container.resolve(DeleteMusculatureUseCase)

    const result = await deleteMusculatureUseCase.execute({ musculatureId })

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
