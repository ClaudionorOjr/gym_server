import { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { DeleteMeasurementsUseCase } from '@workout/application/use-cases/delete-measurements'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { z } from 'zod'

export async function deleteMeasurements(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteMeasurementsParamsSchema = z.object({
    measurementsId: z.string().uuid(),
  })

  const { measurementsId } = deleteMeasurementsParamsSchema.parse(
    request.params,
  )

  try {
    const deleteMeasurementsUseCase = container.resolve(
      DeleteMeasurementsUseCase,
    )

    const result = await deleteMeasurementsUseCase.execute({
      measurementsId,
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
