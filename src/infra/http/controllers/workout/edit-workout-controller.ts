import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { EditWorkoutUseCase } from '@workout/application/use-cases/edit-workout'
import { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { z } from 'zod'

export async function editWorkout(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const editWorkoutParamsSchema = z.object({
    workoutId: z.string().uuid(),
  })

  const editWorkoutBodySchema = z.object({
    series: z.number().optional(),
    repetitions: z.number().optional(),
    weight: z.number().optional(),
    note: z.string().optional(),
  })

  const { workoutId } = editWorkoutParamsSchema.parse(request.params)
  const { series, repetitions, weight, note } = editWorkoutBodySchema.parse(
    request.body,
  )

  try {
    const editWorkoutUseCase = container.resolve(EditWorkoutUseCase)

    const result = await editWorkoutUseCase.execute({
      workoutId,
      series,
      repetitions,
      weight,
      note,
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
