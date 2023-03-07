import { ArrowBack, ZoomIn, ZoomOut } from '@mui/icons-material'
import { Backdrop, CircularProgress, IconButton, Pagination, Tooltip } from '@mui/material'
import { Box, Stack } from '@mui/system'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AccountMenu } from '../AccountMenu'

export const MeiViewer = ({ meiUrl, scoreIri }) => {
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
      <Box flex={1} id="verovio" />
      {!pageCount && (
        <Backdrop open>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </Stack>
  )
}
