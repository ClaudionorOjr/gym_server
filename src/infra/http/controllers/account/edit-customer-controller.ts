import { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'

import { EditCustomerUseCase } from '@account/application/use-cases/edit-customer'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'

import { z } from 'zod'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

export async function editCustomer(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const editCustomerBodySchema = z.object({
    completeName: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    birthdate: z
      .string()
      .transform((date) => dayjs(date, 'DD/MM/YYYY').toDate())
      .optional(),
    paymentDay: z.string().optional(),
  })

  const editCustomerParamsSchema = z.object({
    customerId: z.string().uuid(),
  })

  const { completeName, email, phone, birthdate, paymentDay } =
    editCustomerBodySchema.parse(request.body)
  const { customerId } = editCustomerParamsSchema.parse(request.params)

  try {
    const editCustomerUseCase = container.resolve(EditCustomerUseCase)

    const result = await editCustomerUseCase.execute({
      customerId,
      completeName,
      email,
      phone,
      birthdate,
      paymentDay,
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
