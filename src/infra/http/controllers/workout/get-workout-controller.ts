import { FastifyRequest, FastifyReply } from 'fastify'
import { container } from 'tsyringe'
import { GetWorkoutUseCase } from '@workout/application/use-cases/get-workout'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { z } from 'zod'

export async function getWorkout(request: FastifyRequest, reply: FastifyReply) {
  const getWorkoutParamsSchema = z.object({
    workoutId: z.string().uuid(),
  })

  const { workoutId } = getWorkoutParamsSchema.parse(request.params)

  try {
    const getWorkoutUseCase = container.resolve(GetWorkoutUseCase)

    const result = await getWorkoutUseCase.execute({
      workoutId,
    })

    if (result.isFailure()) {
      throw result.value
    }

    const { workout } = result.value
    return reply.status(200).send({ workout })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}
