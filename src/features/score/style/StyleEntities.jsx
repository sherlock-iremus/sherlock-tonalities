import { findKey } from '../utils'
import { StyleEntity } from './StyleEntity'

export const StyleEntities = ({ items, mode }) =>
  items?.map(item => <StyleEntity key={findKey(item)} {...item} {...{ mode }} />) || null
