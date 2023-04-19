import { useSelector } from 'react-redux'
import { MeiViewer } from './MeiViewer'
import { useParams } from 'react-router-dom'
import { getIri } from '../../utils'
import { useEffect, useState } from 'react'
import { setScore } from '../../app/services/scoreSlice'
import { useDispatch } from 'react-redux'
import { StyleNote } from './StyleNote'
import scores from '../../app/scores.json'
import { DndContext, DragOverlay } from '@dnd-kit/core'
import { Chip } from '@mui/material'

export const ScoreAnnotator = () => {
  const { scoreId, projectId } = useParams()
  const [activeId, setActiveId] = useState(null)

  const dispatch = useDispatch()
  const { meiUrl, scoreTitle, selectedNotes } = useSelector(state => state.score)

  useEffect(() => {
    const scoreIri = getIri(scoreId)
    const score = scores.find(score => score.scoreIri === scoreIri)
    score && dispatch(setScore(score))
  }, [dispatch, scoreId])

  return (
    <DndContext onDragStart={event => setActiveId(event.active.id)} onDragEnd={() => setActiveId(null)}>
      <MeiViewer {...{ meiUrl, scoreTitle, projectId }} />
      <DragOverlay>{activeId && <Chip label={activeId} />}</DragOverlay>
      {selectedNotes.map(note => (
        <StyleNote key={note} noteId={note} />
      ))}
    </DndContext>
  )
}
