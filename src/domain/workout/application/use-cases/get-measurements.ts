import { Either, failure, success } from '@core/either'
import { Measurements } from '@workout/enterprise/entities/measurements'
import { MeasurementsRepository } from '../repositories/measurements-repository'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { inject, injectable } from 'tsyringe'

interface GetMeasurementsUseCaseRequest {
  measurementsId: string
}

type GetMeasurementsUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    measurements: Measurements
  }
>

@injectable()
export class GetMeasurementsUseCase {
  constructor(
    @inject('MeasurementsRepository')
    private measurementsRepository: MeasurementsRepository,
  ) {}

  async execute({
    measurementsId,
  }: GetMeasurementsUseCaseRequest): Promise<GetMeasurementsUseCaseResponse> {
    const measurements =
      await this.measurementsRepository.findById(measurementsId)

    if (!measurements) {
      return failure(new ResourceNotFoundError())
    }

    return success({ measurements })
  }
}
