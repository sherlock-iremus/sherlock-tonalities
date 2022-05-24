import { useEffect } from 'react'
import { useSelector } from 'react-redux'

export const StyleNote = props => {
  const { scoreIri } = useSelector(state => state.score)
  const noteNode = document.getElementById(props.noteIri.slice(scoreIri.length + 1))
  useEffect(() => noteNode?.classList.add(props.mode), [noteNode])
  useEffect(() => () => noteNode?.classList.remove(props.mode), [noteNode])
  return null
}
