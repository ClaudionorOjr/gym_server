import { Either, success } from '@core/either'
import { WorkoutsRepository } from '../repositories/workouts-repository'
import { Workout } from '@workout/enterprise/entities/workout'

interface FetchWorkoutsCustomerUseCaseRequest {
  customerId: string
}

type FetchWorkoutsCustomerUseCaseResponse = Either<
  null,
  {
    workouts: Workout[]
  }
>
export class FetchWorkoutsCustomerUseCase {
  constructor(private workoutsRepository: WorkoutsRepository) {}

  async execute({
    customerId,
  }: FetchWorkoutsCustomerUseCaseRequest): Promise<FetchWorkoutsCustomerUseCaseResponse> {
    const workouts =
      await this.workoutsRepository.findManyByCustomerId(customerId)

    return success({ workouts })
  }
}
