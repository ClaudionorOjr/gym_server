import { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { PrepareWorkoutUseCase } from '@workout/application/use-cases/prepare-workout'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { z } from 'zod'

export async function prepareWorkout(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const prepareWorkoutParamsSchema = z.object({
    customerId: z.string().uuid(),
  })

  const prepareWorkoutBodySchema = z.object({
    exerciseId: z.string().uuid(),
    series: z.number(),
    repetitions: z.number(),
    weight: z.number().optional(),
    note: z.string().optional(),
  })

  const { customerId } = prepareWorkoutParamsSchema.parse(request.params)
  const { exerciseId, series, repetitions, weight, note } =
    prepareWorkoutBodySchema.parse(request.body)

  try {
    const prepareWorkoutUseCase = container.resolve(PrepareWorkoutUseCase)

    const result = await prepareWorkoutUseCase.execute({
      customerId,
      exerciseId,
      series,
      repetitions,
      weight,
      note,
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
