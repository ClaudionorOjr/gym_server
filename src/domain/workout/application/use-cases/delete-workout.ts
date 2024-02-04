import { Either, failure, success } from '@core/either'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { WorkoutsRepository } from '../repositories/workouts-repository'
import { inject, injectable } from 'tsyringe'

interface DeleteWorkoutUseCaseRequest {
  workoutId: string
}
type DeleteWorkoutUseCaseResponse = Either<ResourceNotFoundError, object>

@injectable()
export class DeleteWorkoutUseCase {
  constructor(
    @inject('WorkoutsRepository')
    private workoutsRepository: WorkoutsRepository,
  ) {}

  async execute({
    workoutId,
  }: DeleteWorkoutUseCaseRequest): Promise<DeleteWorkoutUseCaseResponse> {
    const workout = await this.workoutsRepository.findById(workoutId)

    if (!workout) {
      return failure(new ResourceNotFoundError())
    }

    await this.workoutsRepository.delete(workoutId)

    return success({})
  }
}
