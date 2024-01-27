import { ExerciseProps, Exercise } from '@workout/enterprise/entities/exercise'
import { randomUUID } from 'node:crypto'

export function makeExercise(
  override: Partial<ExerciseProps> = {},
  id?: string,
) {
  return Exercise.create(
    {
      name: 'bench press',
      musculatureId: randomUUID(),
      equipment: 'incline bench press',
      ...override,
    },
    id,
  )
}
