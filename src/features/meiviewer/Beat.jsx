import { useGetNotesOnFirstBeatQuery } from '../../app/services/sparqlLocal'
import { drawBeat } from './verovioHelpers'

export const Beat = props => {
  const beat = useGetNotesOnFirstBeatQuery(props.noteId, {skip: !props.noteId})

  return (
    <div> 
      {!beat.isLoading &&
        !beat.error &&
        drawBeat(beat.data.results.bindings.map(binding => binding.notesInBeat.value.slice(props.meiUri.length - 10)))}
    </div>
  )
}
