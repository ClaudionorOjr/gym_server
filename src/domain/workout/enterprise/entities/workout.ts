import { Entity } from '@core/entities/entity'

export interface WorkoutProps {
  customerId: string
  exerciseId: string
  series: number
  repetitions: number
  weight?: number | null
  note?: string | null
}

export class Workout extends Entity<WorkoutProps> {
  /* GETTERS & SETTERS */
  get customerId() {
    return this.props.customerId
  }

  get exerciseId() {
    return this.props.exerciseId
  }

  get series() {
    return this.props.series
  }

  set series(series: number) {
    this.props.series = series
  }

  get repetitions() {
    return this.props.repetitions
  }

  set repetitions(repetitions: number) {
    this.props.repetitions = repetitions
  }

  get weight() {
    return this.props.weight
  }

  set weight(weight: number | undefined | null) {
    this.props.weight = weight
  }

  get note() {
    return this.props.note
  }

  set note(note: string | undefined | null) {
    this.props.note = note
  }

  /* METHODS */
  static create(props: WorkoutProps, id?: string) {
    const workout = new Workout(
      {
        ...props,
      },
      id,
    )

    return workout
  }
}
