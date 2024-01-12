import { FastifyReply, FastifyRequest } from 'fastify'
import { FetchCustomersUseCase } from '@account/application/use-cases/fetch-customers'
import { container } from 'tsyringe'

export async function fetchCustomers(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchCustomersUseCase = container.resolve(FetchCustomersUseCase)

  const result = await fetchCustomersUseCase.execute()

  if (result.isFailure()) {
    return reply.status(400).send({ message: 'Bad request.' })
  }

  const { customers } = result.value
  return reply.status(200).send({ customers })
}
