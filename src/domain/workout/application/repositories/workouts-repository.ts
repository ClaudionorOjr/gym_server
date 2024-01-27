import { Workout } from '@workout/enterprise/entities/workout'

export interface WorkoutsRepository {
  create(workout: Workout): Promise<void>
  findById: (id: string) => Promise<Workout | null>
  findManyByCustomerId: (id: string) => Promise<Workout[]>
  findMany: () => Promise<Workout[]>
  save: (workout: Workout) => Promise<void>
  delete: (id: string) => Promise<void>
}
