import { Exercise } from '@workout/enterprise/entities/exercise'

export interface ExercisesRepository {
  create(exercise: Exercise): Promise<void>
  findById(id: string): Promise<Exercise | null>
  findByName(name: string): Promise<Exercise | null>
  findManyByMusculatureId(musculatureId: string): Promise<Exercise[]>
  findMany(): Promise<Exercise[]>
  save(exercise: Exercise): Promise<void>
  delete(id: string): Promise<void>
}
