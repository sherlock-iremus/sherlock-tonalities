import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { INSPECTED, SELECTED } from '../constants'

export const StyleNote = ({ noteIri }) => {
  const { scoreIri, isInspectionMode, isSelectionMode } = useSelector(state => state.score)
  const mode = (isInspectionMode && INSPECTED) || (isSelectionMode && SELECTED)
  const noteNode = document.getElementById(noteIri.slice(scoreIri.length + 1))
  
  useEffect(() => {
    noteNode?.classList.add(mode)
    return () => noteNode?.classList.remove(mode)
  }, [noteNode, mode])
  
  return null
}
