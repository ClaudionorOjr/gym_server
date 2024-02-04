import { Prisma, Workout as RawWorkout } from '@prisma/client'
import { Workout } from '@workout/enterprise/entities/workout'

export class PrismaWorkoutMapper {
  /**
   * Converts an `Workout` object to a `Prisma.WorkoutUncheckedCreateInput` object.
   *
   * @param {Workout} workout - The `Workout` object to convert.
   * @return {Prisma.WorkoutUncheckedCreateInput} - The converted `Prisma.WorkoutUncheckedCreateInput` object.
   */
  static toPrisma(workout: Workout): Prisma.WorkoutUncheckedCreateInput {
    return {
      id: workout.id,
      customerId: workout.customerId,
      exerciseId: workout.exerciseId,
      repetitions: workout.repetitions,
      series: workout.series,
      weight: workout.weight,
      note: workout.note,
    }
  }

  /**
   * Converts a Prisma raw Workout object into an `Workout` domain object.
   *
   * @param {RawWorkout} raw - The Prisma raw Workout object to convert.
   * @return {Workout} - The converted `Workout` domain object.
   */
  static toDomain(raw: RawWorkout): Workout {
    return Workout.create(
      {
        customerId: raw.customerId,
        exerciseId: raw.exerciseId,
        repetitions: Number(raw.repetitions),
        series: Number(raw.series),
        weight: Number(raw.weight),
        note: raw.note,
      },
      raw.id,
    )
  }
}
