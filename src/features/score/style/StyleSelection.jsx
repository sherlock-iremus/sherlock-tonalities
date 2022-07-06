import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useGetChildSelectionsQuery } from '../../../app/services/sparql'
import { StyleEntity } from './StyleEntity'
import { drawSelection } from '../draw'
import { findKey } from '../utils'
import { INSPECTED, SELECTED } from '../constants'

export const StyleSelection = ({ selectionIri }) => {
  const { scoreIri, isInspectionMode, isSelectionMode } = useSelector(state => state.score)
  const mode = (isInspectionMode && INSPECTED) || (isSelectionMode && SELECTED)
  const { data: children } = useGetChildSelectionsQuery(selectionIri)
  
  useEffect(() => {
    !document.getElementById(selectionIri) && children && drawSelection(children, selectionIri, scoreIri, mode)
    document.getElementById(selectionIri)?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
    return () => document.getElementById(selectionIri)?.remove()
  }, [children, mode, selectionIri, scoreIri])

  return children?.map(child => <StyleEntity key={findKey(child)} {...child} />) || null
}
