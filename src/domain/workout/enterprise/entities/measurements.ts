import { Entity } from '@core/entities/entity'
import { Optional } from '@core/types/optional'

export interface MeasurementsProps {
  customerId: string
  bust: number
  bicep: number
  forearm: number
  waist: number
  hips: number
  thigh: number
  calf: number
  measurementsTakenAt: Date
}

export class Measurements extends Entity<MeasurementsProps> {
  /* GETTERS & SETTERS */
  get customerId() {
    return this.props.customerId
  }

  get bust() {
    return this.props.bust
  }

  set bust(bust: number) {
    this.props.bust = bust
  }

  get bicep() {
    return this.props.bicep
  }

  set bicep(bicep: number) {
    this.props.bicep = bicep
  }

  get forearm() {
    return this.props.forearm
  }

  set forearm(forearm: number) {
    this.props.forearm = forearm
  }

  get waist() {
    return this.props.waist
  }

  set waist(waist: number) {
    this.props.waist = waist
  }

  get hips() {
    return this.props.hips
  }

  set hips(hips: number) {
    this.props.hips = hips
  }

  get thigh() {
    return this.props.thigh
  }

  set thigh(thigh: number) {
    this.props.thigh = thigh
  }

  get calf() {
    return this.props.calf
  }

  set calf(calf: number) {
    this.props.calf = calf
  }

  get measurementsTakenAt() {
    return this.props.measurementsTakenAt
  }

  /* METHODS */
  static create(
    props: Optional<MeasurementsProps, 'measurementsTakenAt'>,
    id?: string,
  ) {
    const measurements = new Measurements(
      {
        ...props,
        measurementsTakenAt: props.measurementsTakenAt ?? new Date(),
      },
      id,
    )

    return measurements
  }
}
