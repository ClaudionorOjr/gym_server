import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { MeasurementsRepository } from '../repositories/measurements-repository'
import { Either, failure, success } from '@core/either'

interface DeleteMeasurementsUseCaseRequest {
  measurementId: string
}

type DeleteMeasurementsUseCaseResponse = Either<ResourceNotFoundError, object>

export class DeleteMeasurementsUseCase {
  constructor(private measurementsRepository: MeasurementsRepository) {}

  async execute({
    measurementId,
  }: DeleteMeasurementsUseCaseRequest): Promise<DeleteMeasurementsUseCaseResponse> {
    const measurements =
      await this.measurementsRepository.findById(measurementId)

    if (!measurements) {
      return failure(new ResourceNotFoundError())
    }

    await this.measurementsRepository.delete(measurementId)

    return success({})
  }
}
