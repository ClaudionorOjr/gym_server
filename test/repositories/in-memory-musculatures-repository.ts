import { MusculaturesRepository } from '@workout/application/repositories/musculatures-repository'
import { Musculature } from '@workout/enterprise/entities/musculature'

export class InMemoryMusculaturesRepository implements MusculaturesRepository {
  public musculatures: Musculature[] = []

  async create(musculature: Musculature): Promise<void> {
    this.musculatures.push(musculature)
  }

  async findById(id: string): Promise<Musculature | null> {
    const musculature = this.musculatures.find(
      (musculature) => musculature.id === id,
    )

    if (!musculature) {
      return null
    }

    return musculature
  }

  async findByName(name: string): Promise<Musculature | null> {
    const musculature = this.musculatures.find(
      (musculature) => musculature.name === name,
    )

    if (!musculature) {
      return null
    }

    return musculature
  }

  async findMany(): Promise<Musculature[]> {
    return this.musculatures
  }

  async delete(id: string): Promise<void> {
    const musculatureIndex = this.musculatures.findIndex(
      (musculature) => musculature.id === id,
    )

    this.musculatures.splice(musculatureIndex, 1)
  }
}
