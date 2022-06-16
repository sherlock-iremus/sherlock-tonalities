import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useGetChildSelectionsQuery } from '../../../app/services/sparql'
import { StyleNote } from './StyleNote'
import { drawSelection } from '../draw'

export const StyleSelection = props => {
  const { scoreIri } = useSelector(state => state.score)
  const { data: children } = useGetChildSelectionsQuery(props.selectionIri)
  const selectionNode = document.getElementById(props.selectionIri)
  useEffect(() => {
    selectionNode ? (selectionNode.style.display = 'block') : children && drawSelection(children, props.selectionIri, scoreIri, props.mode)
    return () => selectionNode && (selectionNode.style.display = 'none')
  }, [selectionNode, children])

  return children?.map(child => child.noteIri && <StyleNote key={child.noteIri} noteIri={child.noteIri} mode={props.mode} />) || null
}
