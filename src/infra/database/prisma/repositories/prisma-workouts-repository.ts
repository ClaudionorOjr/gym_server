import { inject, injectable } from 'tsyringe'
import { PrismaService } from '..'
import { Workout } from '@workout/enterprise/entities/workout'
import { WorkoutsRepository } from '@workout/application/repositories/workouts-repository'
import { PrismaWorkoutMapper } from '../mappers/prisma-workout-mapper'

@injectable()
export class PrismaWorkoutsRepository implements WorkoutsRepository {
  constructor(@inject('Prisma') private prisma: PrismaService) {}

  async create(workout: Workout): Promise<void> {
    const data = PrismaWorkoutMapper.toPrisma(workout)

    await this.prisma.workout.create({
      data,
    })
  }

  async findById(id: string): Promise<Workout | null> {
    const workout = await this.prisma.workout.findUnique({
      where: {
        id,
      },
    })

    if (!workout) {
      return null
    }

    return PrismaWorkoutMapper.toDomain(workout)
  }

  async findManyByCustomerId(id: string): Promise<Workout[]> {
    const workouts = await this.prisma.workout.findMany({
      where: {
        customerId: id,
      },
    })

    return workouts.map(PrismaWorkoutMapper.toDomain)
  }

  async findMany(): Promise<Workout[]> {
    const workouts = await this.prisma.workout.findMany({})

    return workouts.map(PrismaWorkoutMapper.toDomain)
  }

  async save(workout: Workout): Promise<void> {
    const data = PrismaWorkoutMapper.toPrisma(workout)

    await this.prisma.workout.update({
      where: {
        id: workout.id,
      },
      data,
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.workout.delete({
      where: {
        id,
      },
    })
  }
}
