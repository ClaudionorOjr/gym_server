import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { RegisterMeasurementsUseCase } from '@workout/application/use-cases/register-measurements'
import { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { z } from 'zod'

export async function registerMeasurements(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerMeasurementsBodySchema = z.object({
    bust: z.number(),
    biceps: z.number(),
    forearm: z.number(),
    waist: z.number(),
    hips: z.number(),
    thigh: z.number(),
    calf: z.number(),
  })

  const registerMeasurementsParamsSchema = z.object({
    customerId: z.string().uuid(),
  })

  const { bust, biceps, forearm, waist, hips, thigh, calf } =
    registerMeasurementsBodySchema.parse(request.body)
  const { customerId } = registerMeasurementsParamsSchema.parse(request.params)

  try {
    const registerMeasurementsUseCase = container.resolve(
      RegisterMeasurementsUseCase,
    )

    const result = await registerMeasurementsUseCase.execute({
      customerId,
      bust,
      biceps,
      forearm,
      waist,
      hips,
      thigh,
      calf,
    })

    if (result.isFailure()) {
      throw result.value
    }

    return reply.status(201).send()
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}
