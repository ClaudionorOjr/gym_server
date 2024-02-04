import { FastifyRequest, FastifyReply } from 'fastify'
import { container } from 'tsyringe'
import { GetExerciseUseCase } from '@workout/application/use-cases/get-exercise'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { z } from 'zod'

export async function getExercise(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getExerciseParamsSchema = z.object({
    exerciseId: z.string().uuid(),
  })

  const { exerciseId } = getExerciseParamsSchema.parse(request.params)

  try {
    const getExerciseUseCase = container.resolve(GetExerciseUseCase)

    const result = await getExerciseUseCase.execute({ exerciseId })

    if (result.isFailure()) {
      throw result.value
    }

    const { exercise } = result.value
    return reply.status(200).send({ exercise })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}
