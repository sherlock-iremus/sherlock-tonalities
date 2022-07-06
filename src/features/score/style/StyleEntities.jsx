import { findKey } from '../utils'
import { StyleEntity } from './StyleEntity'

export const StyleEntities = ({ items }) =>
  items?.map(item => <StyleEntity key={findKey(item)} {...item} />) || null
