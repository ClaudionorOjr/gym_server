import { FetchWorkoutsCustomerUseCase } from '@workout/application/use-cases/fetch-workouts-customer'
import { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { z } from 'zod'

export async function fetchWorkoutsCustomer(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchWorkoutsCustomerParamsSchema = z.object({
    customerId: z.string().uuid(),
  })

  const { customerId } = fetchWorkoutsCustomerParamsSchema.parse(request.params)

  const fetchWorkoutsCustomerUseCase = container.resolve(
    FetchWorkoutsCustomerUseCase,
  )

  const result = await fetchWorkoutsCustomerUseCase.execute({
    customerId,
  })

  if (result.isFailure()) {
    return reply.status(400).send({
      message: 'Bad request.',
    })
  }

  const { workouts } = result.value
  return reply.status(200).send({ workouts })
}
