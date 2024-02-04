import { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { FetchExercisesUseCase } from '@workout/application/use-cases/fetch-exercises'

export async function fetchExercises(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchExercisesUseCase = container.resolve(FetchExercisesUseCase)

  const result = await fetchExercisesUseCase.execute()

  if (result.isFailure()) {
    return reply.status(400).send({ message: 'Bad request.' })
  }

  const { exercises } = result.value
  return reply.status(200).send({ exercises })
}
