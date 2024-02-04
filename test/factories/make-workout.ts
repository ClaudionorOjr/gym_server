import { faker } from '@faker-js/faker'
import { PrismaWorkoutMapper } from '@infra/database/prisma/mappers/prisma-workout-mapper'
import { PrismaClient } from '@prisma/client'
import { WorkoutProps, Workout } from '@workout/enterprise/entities/workout'
import { randomUUID } from 'node:crypto'

export function makeWorkout(override: Partial<WorkoutProps> = {}, id?: string) {
  return Workout.create(
    {
      customerId: randomUUID(),
      exerciseId: randomUUID(),
      series: faker.number.int({ min: 2, max: 4 }),
      repetitions: faker.number.int({ min: 8, max: 12 }),
      weight: faker.number.int({ min: 2, max: 75 }),
      note: faker.lorem.sentence(),
      ...override,
    },
    id,
  )
}

export class WorkoutFactory {
  constructor(private prisma: PrismaClient) {}
  async makePrismaWorkout(data: Partial<WorkoutProps> = {}, id?: string) {
    const workout = makeWorkout(data, id)

    await this.prisma.workout.create({
      data: PrismaWorkoutMapper.toPrisma(workout),
    })

    return workout
  }
}
