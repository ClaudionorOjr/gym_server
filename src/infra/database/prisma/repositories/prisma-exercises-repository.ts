import { inject, injectable } from 'tsyringe'
import { PrismaService } from '..'
import { ExercisesRepository } from '@workout/application/repositories/exercises-repository'
import { Exercise } from '@workout/enterprise/entities/exercise'
import { PrismaExerciseMapper } from '../mappers/prisma-exercise-mapper'

@injectable()
export class PrismaExercisesRepository implements ExercisesRepository {
  constructor(@inject('Prisma') private prisma: PrismaService) {}

  async create(exercise: Exercise): Promise<void> {
    const data = PrismaExerciseMapper.toPrisma(exercise)

    await this.prisma.exercise.create({
      data,
    })
  }

  async findById(id: string): Promise<Exercise | null> {
    const exercise = await this.prisma.exercise.findUnique({
      where: {
        id,
      },
    })

    if (!exercise) {
      return null
    }

    return PrismaExerciseMapper.toDomain(exercise)
  }

  async findByName(name: string): Promise<Exercise | null> {
    const exercise = await this.prisma.exercise.findUnique({
      where: {
        name,
      },
    })

    if (!exercise) {
      return null
    }

    return PrismaExerciseMapper.toDomain(exercise)
  }

  async findManyByMusculatureId(musculatureId: string): Promise<Exercise[]> {
    const exercises = await this.prisma.exercise.findMany({
      where: {
        musculatureId,
      },
    })

    return exercises.map(PrismaExerciseMapper.toDomain)
  }

  async findMany(): Promise<Exercise[]> {
    const exercises = await this.prisma.exercise.findMany({})

    return exercises.map(PrismaExerciseMapper.toDomain)
  }

  async save(exercise: Exercise): Promise<void> {
    const data = PrismaExerciseMapper.toPrisma(exercise)

    await this.prisma.exercise.update({
      where: {
        id: exercise.id,
      },
      data,
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.exercise.delete({
      where: {
        id,
      },
    })
  }
}
