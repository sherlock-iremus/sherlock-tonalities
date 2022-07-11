import {
  useGetEntityTypeQuery,
  useGetNoteInfoQuery,
  useGetPositionnedNoteInfoQuery,
} from '../../../app/services/sparql'
import { useSelector } from 'react-redux'
import { getScoreLabel } from '../utils'

export const ItemLabel = props => {
  const { data } = useGetEntityTypeQuery(props.iri)
  console.log(data)
  // const { data: positionnedNote } = useGetPositionnedNoteInfoQuery(props.positionnedNoteIri, {
  //   skip: !props.positionnedNoteIri,
  // })
  // const { data: noteLabel } = useGetNoteInfoQuery(props.noteIri || positionnedNote?.attachedNoteIri, {
  //   skip: !props.noteIri || !positionnedNote,
  // })
  const noteLabel = ''
  const baseUrlLength = useSelector(state => state.score.baseUrl.length)

  return (
    (props.noteIri && noteLabel && `Note ${noteLabel}`) ||
    (props.positionnedNoteIri && `Positionned note ${noteLabel}`) ||
    (props.verticalityIri && `Verticality ${props.verticalityIri.slice(baseUrlLength + 42)}`) ||
    (props.selectionIri && 'Selection') ||
    (props.analyticalEntityIri && 'Analytical entity') ||
    (props.annotationIri && 'Annotation') ||
    (props.scoreIri && getScoreLabel(props.scoreIri)) ||
    null
  )
}
