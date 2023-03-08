import { ArrowBack, ZoomIn, ZoomOut } from '@mui/icons-material'
import { Backdrop, CircularProgress, IconButton, Pagination, Tooltip } from '@mui/material'
import { Stack } from '@mui/system'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AccountMenu } from '../AccountMenu'
import { verovioStyle } from './style'

export const MeiViewer = ({ meiUrl }) => {
  const navigate = useNavigate()
  const [pageCount, setPageCount] = useState(0)
  const [scale, setScale] = useState(60)
  const [currentPage, setCurrentPage] = useState(1)

  const loadScore = async () => {
    const file = await (await fetch(meiUrl)).text()
    document.getElementById('verovio').innerHTML = window.tk.renderData(file, {
      scale,
      adjustPageWidth: true,
      adjustPageHeight: true,
      header: 'none',
      footer: 'none',
    })
    setPageCount(window.tk.getPageCount())
  }

  const onPageChange = newPage => {
    if (1 <= newPage && newPage <= pageCount) {
      document.getElementById('verovio').innerHTML = window.tk.renderToSVG(newPage)
      setCurrentPage(newPage)
    }
  }

  const zoom = newScale => {
    window.tk.setOptions({ scale: newScale })
    document.getElementById('verovio').innerHTML = window.tk.renderToSVG(currentPage)
    setScale(newScale)
  }

  const getNote = node =>
    node.classList && node.classList.contains('note') ? node : node.parentNode && getNote(node.parentNode)

  const handleClick = e => {
    const noteId = getNote(e.target)?.id
    const onset = window.tk.getTimesForElement(noteId).realTimeOnsetMilliseconds
    const { notes } = window.tk.getElementsAtTime(onset)
    console.log(notes)
    notes.map(note => document.getElementById(note).classList.add('focused'))
  }

  useEffect(() => {
    loadScore()
  }, [meiUrl])

  return (
    <Stack>
      <Stack
        position="sticky"
        top={0}
        bgcolor="white"
        spacing={2}
        padding={2}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Tooltip title="Back to home">
          <IconButton onClick={() => navigate('/')}>
            <ArrowBack />
          </IconButton>
        </Tooltip>
        <Stack direction="row">
          <Tooltip title="Zoom in">
            <IconButton onClick={() => zoom(scale + 10)}>
              <ZoomIn />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom out">
            <IconButton onClick={() => zoom(scale - 10)}>
              <ZoomOut />
            </IconButton>
          </Tooltip>
          <Pagination
            count={pageCount}
            page={currentPage}
            siblingCount={1}
            boundaryCount={1}
            onChange={e => onPageChange(Number(e.target.textContent))}
            color="primary"
            size="large"
          />
        </Stack>
        <AccountMenu />
      </Stack>
      <Stack direction="row" justifyContent="space-between" alignItems="center" paddingX={2} width="80vw" height="80vh">
        <Stack borderRadius="10px" bgcolor="grey" boxShadow={1}>
          Arbre de concepts
        </Stack>
        <Stack id="verovio" alignSelf="center" onClick={handleClick} />
        <Stack borderRadius="10px" bgcolor="grey" boxShadow={1}>
          Navigateur d'individus
        </Stack>
      </Stack>
      {!pageCount && (
        <Backdrop open>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </Stack>
  )
}
