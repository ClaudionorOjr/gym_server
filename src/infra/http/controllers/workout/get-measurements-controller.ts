import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { GetMeasurementsUseCase } from '@workout/application/use-cases/get-measurements'
import { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { z } from 'zod'

export async function getMeasurements(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getMeasurementsParamsSchema = z.object({
    measurementsId: z.string().uuid(),
  })

  const { measurementsId } = getMeasurementsParamsSchema.parse(request.params)

  try {
    const getMeasurementsUseCase = container.resolve(GetMeasurementsUseCase)

    const result = await getMeasurementsUseCase.execute({
      measurementsId,
    })

    if (result.isFailure()) {
      throw result.value
    }

    const { measurements } = result.value
    return reply.status(200).send({ measurements })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}
