import { Entity } from '@core/entities/entity'

export interface MusculatureProps {
  name: string
}

export class Musculature extends Entity<MusculatureProps> {
  /* GETTERS & SETTERS */
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  /* METHODS */
  static create(props: MusculatureProps, id?: string) {
    const musculature = new Musculature(
      {
        ...props,
      },
      id,
    )

    return musculature
  }
}
