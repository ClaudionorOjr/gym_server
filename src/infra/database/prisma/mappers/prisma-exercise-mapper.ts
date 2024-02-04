import { Prisma, Exercise as RawExercise } from '@prisma/client'
import { Exercise } from '@workout/enterprise/entities/exercise'

export class PrismaExerciseMapper {
  /**
   * Converts an `Exercise` object to a `Prisma.ExerciseUncheckedCreateInput` object.
   *
   * @param {Exercise} exercise - The `Exercise` object to convert.
   * @return {Prisma.ExerciseUncheckedCreateInput} - The converted `Prisma.ExerciseUncheckedCreateInput` object.
   */
  static toPrisma(exercise: Exercise): Prisma.ExerciseUncheckedCreateInput {
    return {
      id: exercise.id,
      name: exercise.name,
      musculatureId: exercise.musculatureId,
      equipment: exercise.equipment,
    }
  }

  /**
   * Converts a Prisma raw Exercise object into an `Exercise` domain object.
   *
   * @param {RawExercise} raw - The Prisma raw Exercise object to convert.
   * @return {Exercise} - The converted `Exercise` domain object.
   */
  static toDomain(raw: RawExercise): Exercise {
    return Exercise.create(
      {
        name: raw.name,
        musculatureId: raw.musculatureId,
        equipment: raw.equipment,
      },
      raw.id,
    )
  }
}
