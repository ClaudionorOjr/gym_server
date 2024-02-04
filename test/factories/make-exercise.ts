import { PrismaExerciseMapper } from '@infra/database/prisma/mappers/prisma-exercise-mapper'
import { PrismaClient } from '@prisma/client'
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

export class ExerciseFactory {
  constructor(private prisma: PrismaClient) {}

  async makePrismaExercise(data: Partial<ExerciseProps> = {}, id?: string) {
    const exercise = makeExercise(data, id)

    await this.prisma.exercise.create({
      data: PrismaExerciseMapper.toPrisma(exercise),
    })

    return exercise
  }
}
