import { Entity } from '@core/entities/entity'
import { Optional } from '@core/types/optional'
import dayjs from 'dayjs'

export interface CustomerProps {
  completeName: string
  email: string
  phone: string
  birthdate: Date
  registeredBy: string
  paymentDay: string
  createdAt: Date
  updatedAt?: Date | null
}

export class Customer extends Entity<CustomerProps> {
  /* GETTERS & SETTERS */
  get completeName() {
    return this.props.completeName
  }

  set completeName(completeName: string) {
    this.props.completeName = completeName
    this.touch()
  }

  get email() {
    return this.props.email
  }

  set email(email: string) {
    this.props.email = email
    this.touch()
  }

  get phone() {
    return this.props.phone
  }

  set phone(phone: string) {
    this.props.phone = phone
    this.touch()
  }

  get birthdate() {
    return this.props.birthdate
  }

  set birthdate(birthdate: Date) {
    this.props.birthdate = birthdate
    this.touch()
  }

  get registeredBy() {
    return this.props.registeredBy
  }

  get paymentDay() {
    return this.props.paymentDay
  }

  set paymentDay(paymentDay: string) {
    this.props.paymentDay = paymentDay
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  /* METHODS */
  private touch() {
    this.props.updatedAt = new Date()
  }

  public age() {
    return dayjs().diff(this.props.birthdate, 'years')
  }

  static create(
    props: Optional<CustomerProps, 'createdAt' | 'paymentDay'>,
    id?: string,
  ) {
    const customer = new Customer(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        paymentDay: props.paymentDay ?? new Date().getDate().toString(),
      },
      id,
    )

    return customer
  }
}
