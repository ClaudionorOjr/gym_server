import { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { RegisterCustomerUseCase } from '@account/application/use-cases/register-customer'
import { UserAlreadyExistsError } from '@account/application/use-cases/errors/user-already-exists-error'

import { z } from 'zod'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

export async function registerCustomer(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerCustomerBodySchema = z.object({
    completeName: z.string(),
    email: z.string().email(),
    phone: z.string(),
    birthdate: z
      .string()
      .transform((date) => dayjs(date, 'DD/MM/YYYY').toDate()),
  })

  const { completeName, email, phone, birthdate } =
    registerCustomerBodySchema.parse(request.body)

  const { sub } = request.user

  try {
    const registerCustomerUseCase = container.resolve(RegisterCustomerUseCase)

    const result = await registerCustomerUseCase.execute({
      completeName,
      email,
      phone,
      birthdate,
      registeredBy: sub,
    })

    if (result.isFailure()) {
      throw result.value
    }

    return reply.status(201).send()
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({
        message: error.message,
      })
    }

    throw error
  }
}
