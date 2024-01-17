import { FetchMeasurementsUseCase } from '@workout/application/use-cases/fetch-measurements'
import { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { z } from 'zod'

export async function fetchMeasurements(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchMeasurementsParamsSchema = z.object({
    customerId: z.string().uuid(),
  })

  const { customerId } = fetchMeasurementsParamsSchema.parse(request.params)

  const fetchMeasurementsUseCase = container.resolve(FetchMeasurementsUseCase)

  const result = await fetchMeasurementsUseCase.execute({
    customerId,
  })

  if (result.isFailure()) {
    return reply.status(400).send({
      message: 'Bad request.',
    })
  }

  const { measurements } = result.value
  return reply.status(200).send({ measurements })
}
