import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useGetChildSelectionsQuery } from '../../../app/services/sparql'
import { StyleNote } from './StyleNote'
import { drawSelection } from '../draw'

export const StyleSelection = props => {
  const { scoreIri } = useSelector(state => state.score)
  const { data: children } = useGetChildSelectionsQuery(props.selectionIri)
  useEffect(() => children && drawSelection(children, props.selectionIri, scoreIri), [])
  useEffect(() => () => document.getElementById(props.selectionIri)?.remove(), [])
  return children?.map(child => child.noteIri && <StyleNote key={child.noteIri} noteIri={child.noteIri} mode="inspected" />) || null
}
