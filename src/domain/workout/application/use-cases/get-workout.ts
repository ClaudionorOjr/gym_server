import { Either, failure, success } from '@core/either'
import { Workout } from '@workout/enterprise/entities/workout'
import { WorkoutsRepository } from '../repositories/workouts-repository'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { inject, injectable } from 'tsyringe'

interface GetWorkoutUseCaseRequest {
  workoutId: string
}

type GetWorkoutUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    workout: Workout
  }
>

@injectable()
export class GetWorkoutUseCase {
  constructor(
    @inject('WorkoutsRepository')
    private workoutsRepository: WorkoutsRepository,
  ) {}

  async execute({
    workoutId,
  }: GetWorkoutUseCaseRequest): Promise<GetWorkoutUseCaseResponse> {
    const workout = await this.workoutsRepository.findById(workoutId)

    if (!workout) {
      return failure(new ResourceNotFoundError())
    }

    return success({ workout })
  }
}
