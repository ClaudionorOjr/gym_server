import { FastifyRequest, FastifyReply } from 'fastify'
import { container } from 'tsyringe'
import { EditExerciseUseCase } from '@workout/application/use-cases/edit-exercise'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { z } from 'zod'

export async function editExercise(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const editExerciseParamsSchema = z.object({
    exerciseId: z.string().uuid(),
  })

  const editExerciseBodySchema = z.object({
    name: z.string().optional(),
    musculatureId: z.string().uuid().optional(),
    equipment: z.string().optional(),
  })

  const { exerciseId } = editExerciseParamsSchema.parse(request.params)

  const { name, musculatureId, equipment } = editExerciseBodySchema.parse(
    request.body,
  )

  try {
    const editExerciseUseCase = container.resolve(EditExerciseUseCase)

    const result = await editExerciseUseCase.execute({
      exerciseId,
      name,
      musculatureId,
      equipment,
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
