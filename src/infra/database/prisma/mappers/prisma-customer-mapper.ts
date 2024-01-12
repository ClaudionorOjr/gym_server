import { Customer } from '@account/enterprise/entities/customer'
import { Prisma, Customer as RawCustomer } from '@prisma/client'

export class PrismaCustomerMapper {
  /**
   * Converts an `Customer` object to a `Prisma.CustomerUncheckedCreateInput` object.
   *
   * @param {Customer} customer - The `Customer` object to convert.
   * @return {Prisma.CustomerUncheckedCreateInput} - The converted `Prisma.CustomerUncheckedCreateInput` object.
   */
  static toPrisma(customer: Customer): Prisma.CustomerUncheckedCreateInput {
    return {
      id: customer.id,
      completeName: customer.completeName,
      email: customer.email,
      phone: customer.phone,
      birthdate: customer.birthdate,
      registeredBy: customer.registeredBy,
      paymentDay: customer.paymentDay,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    }
  }

  /**
   * Converts a Prisma raw Customer object into an `Customer` domain object.
   *
   * @param {RawCustomer} raw - The Prisma raw Customer object to convert.
   * @return {Customer} - The converted `Customer` domain object.
   */
  static toDomain(raw: RawCustomer): Customer {
    return Customer.create(
      {
        completeName: raw.completeName,
        email: raw.email,
        phone: raw.phone,
        birthdate: raw.birthdate,
        registeredBy: raw.registeredBy,
        paymentDay: raw.paymentDay,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      raw.id,
    )
  }
}
