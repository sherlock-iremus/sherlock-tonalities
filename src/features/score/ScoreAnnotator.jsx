import { useSelector } from 'react-redux'
import { MeiViewer } from './MeiViewer'
import { useParams } from 'react-router-dom'
import { getIri } from '../../utils'
import { useEffect } from 'react'
import { setScore, setSelectedNotes } from '../../app/services/scoreSlice'
import { useDispatch } from 'react-redux'
import { StyleNote } from './StyleNote'
import { Button, Snackbar } from '@mui/material'
import scores from '../../app/scores.json'

export const ScoreAnnotator = () => {
  const { scoreId, projectId } = useParams()
  const dispatch = useDispatch()
  const { meiUrl, scoreTitle, selectedNotes } = useSelector(state => state.score)

  useEffect(() => {
    const scoreIri = getIri(scoreId)
    const score = scores.find(score => score.scoreIri === scoreIri)
    score && dispatch(setScore(score))
  }, [dispatch, scoreId])

  return (
    <>
      <MeiViewer {...{ meiUrl, scoreTitle, projectId }} />
      <Snackbar
        open={!!selectedNotes.length}
        sx={{ paddingTop: 7 }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        message={selectedNotes.length === 1 ? 'One selected note' : selectedNotes.length + ' selected notes'}
        action={
          <Button size="small" onClick={() => dispatch(setSelectedNotes())}>
            UNDO
          </Button>
        }
      />
      {selectedNotes.map(note => (
        <StyleNote key={note} noteId={note} />
      ))}
    </>
  )
}
