import { useSelector } from 'react-redux'
import { MeiViewer } from './MeiViewer'
import { useParams } from 'react-router-dom'
import { getIri } from '../../utils'
import { useEffect } from 'react'
import { setScore } from '../../app/services/scoreSlice'
import { useDispatch } from 'react-redux'
import { StyleNote } from './StyleNote'
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

      {selectedNotes.map(note => (
        //bug : refresh on zoom
        <StyleNote key={note} noteId={note} />
      ))}
    </>
  )
}
