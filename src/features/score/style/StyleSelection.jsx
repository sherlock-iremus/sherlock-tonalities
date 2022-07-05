import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useGetChildSelectionsQuery } from '../../../app/services/sparql'
import { StyleEntity } from './StyleEntity'
import { drawSelection } from '../draw'
import { findKey } from '../utils'

export const StyleSelection = props => {
  const { scoreIri } = useSelector(state => state.score)
  const { data: children } = useGetChildSelectionsQuery(props.selectionIri)
  children && console.log(children)
  useEffect(() => {
    !document.getElementById(props.selectionIri) &&
      children &&
      drawSelection(children, props.selectionIri, scoreIri, props.mode)
    document
      .getElementById(props.selectionIri)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
    return () => document.getElementById(props.selectionIri)?.remove()
  }, [children, props.mode, props.selectionIri, scoreIri])

  return children?.map(child => <StyleEntity key={findKey(child)} {...child} />) || null
}
