import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { DeleteExerciseUseCase } from '@workout/application/use-cases/delete-exercise'
import { FastifyRequest, FastifyReply } from 'fastify'
import { container } from 'tsyringe'
import { z } from 'zod'

export async function deleteExercise(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteExerciseParamsSchema = z.object({
    exerciseId: z.string().uuid(),
  })

  const { exerciseId } = deleteExerciseParamsSchema.parse(request.params)

  try {
    const deleteExerciseUseCase = container.resolve(DeleteExerciseUseCase)

    const result = await deleteExerciseUseCase.execute({ exerciseId })

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
