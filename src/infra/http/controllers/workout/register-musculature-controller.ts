import { FastifyRequest, FastifyReply } from 'fastify'
import { container } from 'tsyringe'
import { RegisterMusculatureUseCase } from '@workout/application/use-cases/register-musculature'
import { ResourceAlreadyExistsError } from '@core/errors/resource-already-exists-error'
import { z } from 'zod'

export async function registerMusculature(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerMusculatureBodySchema = z.object({
    name: z.string(),
  })

  const { name } = registerMusculatureBodySchema.parse(request.body)

  try {
    const registerMusculatureUseCase = container.resolve(
      RegisterMusculatureUseCase,
    )

    const result = await registerMusculatureUseCase.execute({
      name,
    })

    if (result.isFailure()) {
      throw result.value
    }

    return reply.status(201).send()
  } catch (error) {
    if (error instanceof ResourceAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }
}
