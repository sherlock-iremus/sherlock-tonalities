/* eslint-disable react-hooks/exhaustive-deps */
import { ArrowBack, ZoomIn, ZoomOut } from '@mui/icons-material'
import { Backdrop, Button, CircularProgress, IconButton, Pagination, Tooltip, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'
import { Stack } from '@mui/system'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setSelectedNotes } from '../../app/services/scoreSlice'
import { circleShape, findInBetweenNotes, noteCoords } from '../../draw'
import { AccountMenu } from '../AccountMenu'
import { verovioStyle } from './style'
import { getIri } from '../../utils'
import { Editor } from './Editor'
import { Model } from './Model'
import { Project } from './Project'

export const MeiViewer = ({ meiUrl, scoreTitle, projectId }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [pageCount, setPageCount] = useState(0)
  const [scale, setScale] = useState(30)
  const [currentPage, setCurrentPage] = useState(1)
  const [finalNoteId, setFinalNoteId] = useState(null)
  const { selectedNotes } = useSelector(state => state.score)

  const verovio = document.getElementById('verovio')
  const toolkit = window.tk

  const loadScore = async () => {
    const file = await (await fetch(meiUrl)).text()
    if (verovio)
      verovio.innerHTML = toolkit.renderData(file, {
        scale,
        adjustPageWidth: true,
        adjustPageHeight: true,
        header: 'none',
        footer: 'none',
      })
    setPageCount(toolkit.getPageCount())
    triggerNotes()
  }

  const triggerNotes = () => {
    const notes = document.querySelectorAll('.note')
    const svg = verovio?.children[0]
    svg?.addEventListener('click', e => e.target === svg && dispatch(setSelectedNotes()))
    notes.forEach(note => {
      const coordinates = noteCoords(note)
      const bubble = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      bubble.setAttribute('id', 'bubble')
      bubble.setAttribute('d', circleShape(coordinates, 300))
      bubble.setAttribute('fill', 'transparent')
      note.setAttribute('cursor', 'pointer')
      note.insertBefore(bubble, note.children[0])
      note.addEventListener('click', e => {
        if (e.shiftKey) setFinalNoteId(e.currentTarget.id)
        else if (e.altKey) addVerticality(toolkit.getTimeForElement(e.currentTarget.id))
        else dispatch(setSelectedNotes(e.currentTarget.id))
      })
      note.addEventListener('mouseover', e => e.currentTarget.children[0].setAttribute('fill', 'grey'))
      note.addEventListener('mouseout', e => e.currentTarget.children[0].setAttribute('fill', 'transparent'))
    })
  }

  const addVerticality = time => {
    dispatch(setSelectedNotes(toolkit.getElementsAtTime(time).notes))
  }

  const reloadVerovio = page => (verovio.innerHTML = toolkit.renderToSVG(page))

  const onPageChange = newPage => {
    reloadVerovio(newPage)
    setCurrentPage(newPage)
    triggerNotes()
  }

  const zoom = newScale => {
    toolkit.setOptions({ scale: newScale })
    reloadVerovio(currentPage)
    setScale(newScale)
    triggerNotes()
  }

  useEffect(() => {
    loadScore()
  }, [meiUrl])

  useEffect(() => {
    if (finalNoteId) {
      if (selectedNotes.length)
        dispatch(setSelectedNotes(findInBetweenNotes(selectedNotes[selectedNotes.length - 1], finalNoteId)))
      setFinalNoteId(null)
    }
  }, [finalNoteId])

  return (
    <Stack height="100vh" bgcolor={grey[100]}>
      <Stack padding={2} direction="row" alignItems="center">
        <Stack flex={1} direction="row" alignItems="center" spacing={1}>
          <Tooltip title="Back to home">
            <IconButton onClick={() => navigate('/')}>
              <ArrowBack />
            </IconButton>
          </Tooltip>
          <Typography>{scoreTitle}</Typography>
        </Stack>
        <Stack flex={1} direction="row" justifyContent="center" alignItems="center" spacing={1}>
          <Pagination
            count={pageCount}
            page={currentPage}
            siblingCount={0}
            boundaryCount={1}
            onChange={(event, value) => onPageChange(value)}
            color="primary"
          />
          <Tooltip title="Zoom out">
            <IconButton onClick={() => zoom(scale - 10)} size="small">
              <ZoomOut />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom in">
            <IconButton onClick={() => zoom(scale + 10)} size="small">
              <ZoomIn />
            </IconButton>
          </Tooltip>
        </Stack>
        <Stack flex={1} direction="row" justifyContent="end" alignItems="center" spacing={2}>
          <Button size="small" disabled variant="contained">
            Publish
          </Button>
          <AccountMenu />
        </Stack>
      </Stack>
      <Stack flex={1} direction="row" justifyContent="center" minHeight={0} spacing={2} pb={2} px={2}>
        <Stack flex={1}>
          <Model />
        </Stack>

        <Stack flex={2} borderRadius={3} bgcolor="white" boxShadow={1} overflow="scroll">
          <Stack id="verovio" sx={verovioStyle} />
        </Stack>

        <Stack flex={1} spacing={2}>
          <Editor />
          <Project projectIri={getIri(projectId)} />
        </Stack>
      </Stack>
      <Backdrop open={!pageCount}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Stack>
  )
}
