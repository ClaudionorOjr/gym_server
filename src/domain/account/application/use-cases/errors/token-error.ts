import { UseCaseError } from '@core/errors/use-case-error'

export class TokenError extends Error implements UseCaseError {
  constructor(message: string) {
    super(message)
  }
}
