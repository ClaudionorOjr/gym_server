import {
  Musculature,
  MusculatureProps,
} from '@workout/enterprise/entities/musculature'

export function makeMusculature(
  override: Partial<MusculatureProps> = {},
  id?: string,
) {
  return Musculature.create(
    {
      name: 'Coxa',
      ...override,
    },
    id,
  )
}
