import { Either, success } from '@core/either'
import { WorkoutsRepository } from '../repositories/workouts-repository'
import { Workout } from '@workout/enterprise/entities/workout'
import { inject, injectable } from 'tsyringe'

interface FetchWorkoutsCustomerUseCaseRequest {
  customerId: string
}

type FetchWorkoutsCustomerUseCaseResponse = Either<
  null,
  {
    workouts: Workout[]
  }
>

@injectable()
export class FetchWorkoutsCustomerUseCase {
  constructor(
    @inject('WorkoutsRepository')
    private workoutsRepository: WorkoutsRepository,
  ) {}

  async execute({
    customerId,
  }: FetchWorkoutsCustomerUseCaseRequest): Promise<FetchWorkoutsCustomerUseCaseResponse> {
    const workouts =
      await this.workoutsRepository.findManyByCustomerId(customerId)

    return success({ workouts })
  }
}
