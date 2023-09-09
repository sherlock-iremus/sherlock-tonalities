/* eslint-disable react-hooks/exhaustive-deps */
import { MeiViewer } from './MeiViewer'
import { useLocation, useParams } from 'react-router-dom'
import { getIri } from '../../utils'
import { useEffect, useState } from 'react'
import scores from '../../config/scores.json'
import { useDispatch } from 'react-redux'
import { setScoreAnnotator } from '../../services/globals'
import { Dialog, DialogTitle, IconButton, Stack, Tooltip } from '@mui/material'
import { UploadFile } from '@mui/icons-material'

export const ScoreAnnotator = () => {
  const { scoreId, projectId } = useParams()
  const { state } = useLocation()
  const [file, setFile] = useState(null)
  const dispatch = useDispatch()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleFileUpload = async e => {
    setFile(await e.target.files[0].text())
    setIsDialogOpen(false)
  }

  const getFile = async () => {
    if (state) setFile(await state.upload.text())
    else {
      const url = scores.find(score => score.scoreIri === getIri(scoreId))?.meiUrl
      if (!url) setIsDialogOpen(true)
      setFile(await (await fetch(url)).text())
    }
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
