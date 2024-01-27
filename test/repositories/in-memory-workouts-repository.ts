import { WorkoutsRepository } from '@workout/application/repositories/workouts-repository'
import { Workout } from '@workout/enterprise/entities/workout'

export class InMemoryWorkoutsRepository implements WorkoutsRepository {
  public workouts: Workout[] = []

  async create(workout: Workout): Promise<void> {
    this.workouts.push(workout)
  }

  async findById(id: string): Promise<Workout | null> {
    const workout = this.workouts.find((workout) => workout.id === id)

    if (!workout) {
      return null
    }

    return workout
  }

  async findManyByCustomerId(id: string): Promise<Workout[]> {
    const workouts = this.workouts.filter(
      (workout) => workout.customerId === id,
    )

    return workouts
  }

  async findMany(): Promise<Workout[]> {
    return this.workouts
  }

  async save(workout: Workout): Promise<void> {
    const workoutIndex = this.workouts.findIndex(
      (item) => item.id === workout.id,
    )

    this.workouts[workoutIndex] = workout
  }

  async delete(id: string): Promise<void> {
    const workoutIndex = this.workouts.findIndex((workout) => workout.id === id)

    this.workouts.splice(workoutIndex, 1)
  }
}
