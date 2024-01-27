import { CustomersRepository } from '@account/application/repositories/customers-repository'
import { Either, failure, success } from '@core/either'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { Workout } from '@workout/enterprise/entities/workout'
import { ExercisesRepository } from '../repositories/exercises-repository'
import { WorkoutsRepository } from '../repositories/workouts-repository'

interface PrepareWorkoutUseCaseRequest {
  customerId: string
  exerciseId: string
  series: number
  repetitions: number
  weight?: number
  note?: string
}

type PrepareWorkoutUseCaseResponse = Either<ResourceNotFoundError, object>
export class PrepareWorkoutUseCase {
  constructor(
    private workoutsRepository: WorkoutsRepository,
    private customersRepository: CustomersRepository,
    private exercisesRepository: ExercisesRepository,
  ) {}

  async execute({
    customerId,
    exerciseId,
    series,
    repetitions,
    weight,
    note,
  }: PrepareWorkoutUseCaseRequest): Promise<PrepareWorkoutUseCaseResponse> {
    const customer = await this.customersRepository.findById(customerId)

    if (!customer) {
      return failure(new ResourceNotFoundError())
    }

    const exercise = await this.exercisesRepository.findById(exerciseId)

    if (!exercise) {
      return failure(new ResourceNotFoundError())
    }

    const workout = Workout.create({
      customerId,
      exerciseId,
      series,
      repetitions,
      weight,
      note,
    })

    await this.workoutsRepository.create(workout)

    return success({})
  }
}
