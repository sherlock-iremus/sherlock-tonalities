import { ArrowBack, ZoomIn, ZoomOut } from '@mui/icons-material'
import { Backdrop, CircularProgress, IconButton, Pagination, TextField, Tooltip } from '@mui/material'
import { grey } from '@mui/material/colors'
import { Stack } from '@mui/system'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { circleShape, noteCoords } from '../../draw'
import { AccountMenu } from '../AccountMenu'
import { verovioStyle } from './style'

export const MeiViewer = ({ meiUrl }) => {
  const navigate = useNavigate()
  const [pageCount, setPageCount] = useState(0)
  const [offset, setOffset] = useState(0)
  const [scale, setScale] = useState(40)
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
    triggerNotes()
  }

  const triggerNotes = () => {
    const notes = document.querySelectorAll('.note')
    notes.forEach(note => {
      const coordinates = noteCoords(note)
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      rect.setAttribute('d', circleShape(coordinates, 300))
      rect.setAttribute('fill', 'transparent')
      note.insertBefore(rect, note.children[0])
      note.addEventListener('click', e => console.log(e.currentTarget))
      note.addEventListener('mouseover', e => e.currentTarget.children[0].setAttribute('fill', 'grey'))
      note.addEventListener('mouseout', e => e.currentTarget.children[0].setAttribute('fill', 'transparent'))
    })
  }

  const onPageChange = newPage => {
    document.getElementById('verovio').innerHTML = window.tk.renderToSVG(newPage)
    setCurrentPage(newPage)
    triggerNotes()
  }

  const zoom = newScale => {
    window.tk.setOptions({ scale: newScale })
    document.getElementById('verovio').innerHTML = window.tk.renderToSVG(currentPage)
    setScale(newScale)
  }

  useEffect(() => {
    loadScore()
  }, [meiUrl])

  return (
    <Stack height="100vh" bgcolor={grey[100]}>
      <Stack padding={2} direction="row" justifyContent="space-between" alignItems="center">
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
            onChange={(event, value) => onPageChange(value)}
            color="primary"
            size="large"
          />
        </Stack>
        <AccountMenu />
      </Stack>
      <Stack flex={1} alignItems="center" justifyContent="center">
        <Stack borderRadius={4} bgcolor="white" boxShadow={1} width="62%" height="85vh" overflow="scroll">
          <Stack id="verovio" sx={verovioStyle} />
        </Stack>

        {!pageCount && (
          <Backdrop open>
            <CircularProgress color="inherit" />
          </Backdrop>
        )}
      </Stack>
    </Stack>
  )
}
