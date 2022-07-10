import { AnalyticalEntities } from '../annotations/AnalyticalEntities'
import { ClassItem } from '../items/ClassItem'

export const ConceptEntity = ({ conceptIri }) => (
  <>
    <ClassItem classIri={conceptIri} />
    <AnalyticalEntities {...{ conceptIri }} />
  </>
)
