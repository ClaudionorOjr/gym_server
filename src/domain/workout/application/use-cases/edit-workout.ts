import { Either, failure, success } from '@core/either'
import { WorkoutsRepository } from '../repositories/workouts-repository'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'

interface EditWorkoutUseCaseRequest {
  workoutId: string
  series?: number
  repetitions?: number
  weight?: number
  note?: string
}

type EditWorkoutUseCaseResponse = Either<ResourceNotFoundError, object>

export class EditWorkoutUseCase {
  constructor(private workoutsRepository: WorkoutsRepository) {}

  async execute({
    workoutId,
    series,
    repetitions,
    weight,
    note,
  }: EditWorkoutUseCaseRequest): Promise<EditWorkoutUseCaseResponse> {
    const workout = await this.workoutsRepository.findById(workoutId)

    if (!workout) {
      return failure(new ResourceNotFoundError())
    }

    workout.series = series ?? workout.series
    workout.repetitions = repetitions ?? workout.repetitions
    workout.weight = weight ?? workout.weight
    workout.note = note ?? workout.note

    await this.workoutsRepository.save(workout)

    return success({})
  }
}
