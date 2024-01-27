import { Entity } from '@core/entities/entity'

export interface ExerciseProps {
  name: string
  musculatureId: string
  equipment?: string | null
}

export class Exercise extends Entity<ExerciseProps> {
  /* GETTERS & SETTERS */
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  get musculatureId() {
    return this.props.musculatureId
  }

  set musculatureId(musculatureId: string) {
    this.props.musculatureId = musculatureId
  }

  get equipment() {
    return this.props.equipment
  }

  set equipment(equipment: string | undefined | null) {
    this.props.equipment = equipment
  }

  /* METHODS */

  static create(props: ExerciseProps, id?: string) {
    const exercise = new Exercise(
      {
        ...props,
      },
      id,
    )

    return exercise
  }
}
