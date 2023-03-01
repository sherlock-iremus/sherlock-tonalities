import { ArrowBack, ZoomIn, ZoomOut } from '@mui/icons-material'
import { Avatar, Backdrop, CircularProgress, IconButton, Pagination } from '@mui/material'
import { Box, Stack } from '@mui/system'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

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

  useEffect(() => {
    loadScore()
  }, [meiUrl])

  return (
    <Stack>
      <Stack spacing={2} padding={2} direction="row" justifyContent="space-between">
        <IconButton onClick={() => navigate('/')}>
          <ArrowBack />
        </IconButton>
        <Stack direction="row">
          <IconButton
            onClick={() =>
              window.tk.setOptions({
                scale: scale + 10,
              }) && setScale(scale + 10)
            }
          >
            <ZoomIn />
          </IconButton>
          <IconButton
            onClick={() =>
              window.tk.setOptions({
                scale: scale - 10,
              }) && setScale(scale - 10)
            }
          >
            <ZoomOut />
          </IconButton>
          <Pagination
            count={pageCount}
            page={currentPage}
            onChange={e => onPageChange(Number(e.target.textContent))}
            color="primary"
            size="large"
          />
        </Stack>
        <Avatar />
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
