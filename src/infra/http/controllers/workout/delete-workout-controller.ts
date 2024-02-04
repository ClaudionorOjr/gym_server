import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { DeleteWorkoutUseCase } from '@workout/application/use-cases/delete-workout'
import { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { z } from 'zod'

export async function deleteWorkout(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteWorkoutParamsSchema = z.object({
    workoutId: z.string().uuid(),
  })

  const { workoutId } = deleteWorkoutParamsSchema.parse(request.params)

  try {
    const deleteWorkoutUseCase = container.resolve(DeleteWorkoutUseCase)

    const result = await deleteWorkoutUseCase.execute({ workoutId })

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
