import { Entity } from '@core/entities/entity'
import { Optional } from '@core/types/optional'

export interface AdminProps {
  completeName: string
  email: string
  passwordHash: string
  phone: string
  createdAt: Date
  updatedAt?: Date | null
}

export class Admin extends Entity<AdminProps> {
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

  get passwordHash() {
    return this.props.passwordHash
  }

  set passwordHash(passwordHash: string) {
    this.props.passwordHash = passwordHash
    this.touch()
  }

  get phone() {
    return this.props.phone
  }

  set phone(phone: string) {
    this.props.phone = phone
    this.touch()
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

  static create(props: Optional<AdminProps, 'createdAt'>, id?: string) {
    const admin = new Admin(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return admin
  }
}
