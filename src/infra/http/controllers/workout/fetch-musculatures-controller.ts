import { FastifyRequest, FastifyReply } from 'fastify'
import { container } from 'tsyringe'
import { FetchMusculaturesUseCase } from '@workout/application/use-cases/fetch-musculatures'

export async function fetchMusculatures(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchMusculaturesUseCase = container.resolve(FetchMusculaturesUseCase)

  const result = await fetchMusculaturesUseCase.execute()

  if (result.isFailure()) {
    return reply.status(400).send({ message: 'Bad request.' })
  }

  const { musculatures } = result.value
  return reply.status(200).send({ musculatures })
}
