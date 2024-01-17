import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { MeasurementsRepository } from '../repositories/measurements-repository'
import { Either, failure, success } from '@core/either'
import { inject, injectable } from 'tsyringe'

interface DeleteMeasurementsUseCaseRequest {
  measurementsId: string
}

type DeleteMeasurementsUseCaseResponse = Either<ResourceNotFoundError, object>

@injectable()
export class DeleteMeasurementsUseCase {
  constructor(
    @inject('MeasurementsRepository')
    private measurementsRepository: MeasurementsRepository,
  ) {}

  async execute({
    measurementsId,
  }: DeleteMeasurementsUseCaseRequest): Promise<DeleteMeasurementsUseCaseResponse> {
    const measurements =
      await this.measurementsRepository.findById(measurementsId)

    if (!measurements) {
      return failure(new ResourceNotFoundError())
    }

    await this.measurementsRepository.delete(measurementsId)

    return success({})
  }
}
