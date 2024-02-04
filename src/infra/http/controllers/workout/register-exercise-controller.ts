import { container } from 'tsyringe'
import { FastifyRequest, FastifyReply } from 'fastify'
import { RegisterExerciseUseCase } from '@workout/application/use-cases/register-exercise'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { ResourceAlreadyExistsError } from '@core/errors/resource-already-exists-error'
import { z } from 'zod'

export async function registerExercise(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerExerciseBodySchema = z.object({
    name: z.string(),
    musculatureId: z.string().uuid(),
    equipment: z.string().optional(),
  })

  const { name, musculatureId, equipment } = registerExerciseBodySchema.parse(
    request.body,
  )

  try {
    const registerExerciseUseCase = container.resolve(RegisterExerciseUseCase)

    const result = await registerExerciseUseCase.execute({
      name,
      musculatureId,
      equipment,
    })

    if (result.isFailure()) {
      throw result.value
    }

    return reply.status(201).send()
  } catch (error) {
    if (error instanceof ResourceAlreadyExistsError) {
      return reply.status(409).send({
        message: error.message,
      })
    }

    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({
        message: error.message,
      })
    }
  }
}
