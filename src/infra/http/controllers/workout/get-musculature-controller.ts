import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { GetMusculatureUseCase } from '@workout/application/use-cases/get-musculature'
import { FastifyRequest, FastifyReply } from 'fastify'
import { container } from 'tsyringe'
import { z } from 'zod'

export async function getMusculature(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getMusculatureParamsSchema = z.object({
    musculatureId: z.string().uuid(),
  })

  const { musculatureId } = getMusculatureParamsSchema.parse(request.params)

  try {
    const getMusculatureUseCase = container.resolve(GetMusculatureUseCase)

    const result = await getMusculatureUseCase.execute({ musculatureId })

    if (result.isFailure()) {
      throw result.value
    }

    const { musculature } = result.value
    return reply.status(200).send({ musculature })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}
