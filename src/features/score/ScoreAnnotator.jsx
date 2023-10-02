/* eslint-disable react-hooks/exhaustive-deps */
import { MeiViewer } from './MeiViewer'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getIri } from '../../utils'
import { useEffect, useState } from 'react'
import scores from '../../config/scores.json'
import { useDispatch } from 'react-redux'
import { setScoreUrl, setScoreAnnotator } from '../../services/globals'
import { Dialog, DialogTitle, IconButton, Stack, Tooltip } from '@mui/material'
import { UploadFile } from '@mui/icons-material'

export const ScoreAnnotator = () => {
  const { scoreId, projectId } = useParams()
  const { state } = useLocation()
  const [file, setFile] = useState(null)
  const dispatch = useDispatch()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const navigate = useNavigate()

  const handleFileUpload = e => {
    const upload = e.target.files[0]
    setIsDialogOpen(false)
    navigate('.', { state: { upload } })
  }

  const getFile = async () => {
    const scoreUrl = scores.find(score => score.scoreIri === getIri(scoreId))?.meiUrl
    if (scoreUrl) {
      setFile(await (await fetch(scoreUrl)).text())
      dispatch(setScoreUrl(encodeURI(scoreUrl)))
    } else if (state.upload) setFile(await state.upload.text())
    else setIsDialogOpen(true)
    dispatch(setScoreAnnotator({ scoreIri: getIri(scoreId), projectIri: getIri(projectId) }))
  }

  useEffect(() => {
    getFile()
  }, [])

  if (isDialogOpen)
    return (
      <Dialog open>
        <DialogTitle>Session expired, you need to re-upload MEI file to view your work</DialogTitle>
        <Stack justifyContent="center">
          <Tooltip title="Upload MEI file">
            <IconButton color="primary" aria-label="upload picture" component="label">
              <input hidden accept=".mei" type="file" onChange={handleFileUpload} />
              <UploadFile />
            </IconButton>
          </Tooltip>
        </Stack>
      </Dialog>
    )
  else if (file) return <MeiViewer {...{ file }} />
  else return null
}
