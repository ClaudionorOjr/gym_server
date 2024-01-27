import { Musculature } from '@workout/enterprise/entities/musculature'

export interface MusculaturesRepository {
  create(musculature: Musculature): Promise<void>
  findById(id: string): Promise<Musculature | null>
  findByName(name: string): Promise<Musculature | null>
  findMany(): Promise<Musculature[]>
  delete(id: string): Promise<void>
}
