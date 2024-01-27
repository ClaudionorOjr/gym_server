import { ExercisesRepository } from '@workout/application/repositories/exercises-repository'
import { Exercise } from '@workout/enterprise/entities/exercise'

export class InMemoryExercisesRepository implements ExercisesRepository {
  public exercises: Exercise[] = []

  async create(exercise: Exercise): Promise<void> {
    this.exercises.push(exercise)
  }

  async findById(id: string): Promise<Exercise | null> {
    const exercise = this.exercises.find((exercise) => exercise.id === id)

    if (!exercise) {
      return null
    }

    return exercise
  }

  async findByName(name: string): Promise<Exercise | null> {
    const exercise = this.exercises.find((exercise) => exercise.name === name)

    if (!exercise) {
      return null
    }

    return exercise
  }

  async findManyByMusculatureId(musculatureId: string): Promise<Exercise[]> {
    const exercises = this.exercises.filter(
      (exercise) => exercise.musculatureId === musculatureId,
    )

    return exercises
  }

  async findMany(): Promise<Exercise[]> {
    return this.exercises
  }

  async save(exercise: Exercise): Promise<void> {
    const exerciseIndex = this.exercises.findIndex(
      (item) => item.id === exercise.id,
    )

    this.exercises[exerciseIndex] = exercise
  }

  async delete(id: string): Promise<void> {
    const exerciseIndex = this.exercises.findIndex(
      (exercise) => exercise.id === id,
    )

    this.exercises.splice(exerciseIndex, 1)
  }
}
