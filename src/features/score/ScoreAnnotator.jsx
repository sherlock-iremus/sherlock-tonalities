/** @jsxImportSource @emotion/react */

import { useSelector } from 'react-redux'
import { MeiViewer } from './MeiViewer'
import { useParams } from 'react-router-dom'
import { getSherlockIriFromUuid } from '../../utils'
import { useEffect } from 'react'
import { setScore } from '../../app/services/scoreSlice'
import { useDispatch } from 'react-redux'
import { StyleNote } from './StyleNote'
import scores from '../../app/scores.json'

export const ScoreAnnotator = () => {
  const { scoreId } = useParams()
  const dispatch = useDispatch()
  const { meiUrl, scoreTitle, selectedNotes } = useSelector(state => state.score)

  useEffect(() => {
    const scoreIri = getSherlockIriFromUuid(scoreId)
    const score = scores.find(score => score.scoreIri === scoreIri)
    score && dispatch(setScore(score))
  }, [dispatch, scoreId])

  return (
    <>
      <MeiViewer {...{ meiUrl, scoreTitle }} />
      {selectedNotes.map(note => (
        <StyleNote key={note} noteId={note} />
      ))}
    </>
  )
}
