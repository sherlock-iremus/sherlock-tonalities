/** @jsxImportSource @emotion/react */

import { useEffect, useState } from 'react'
import { verovioStyle } from './mei.css'

export const MeiViewer = ({ meiUrl, scoreIri }) => {
  const [pageCount, setPageCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const loadScore = async () => {
    const blob = await fetch(meiUrl)
    const file = await blob.text()
    window.tk.loadData(file)
    document.getElementById('verovio').innerHTML = window.tk.renderToSVG(1)
    setPageCount(window.tk.getPageCount())
  }

  useEffect(() => {
    if (1 <= currentPage && currentPage <= pageCount) {
      const svg = window.tk.renderToSVG(currentPage)
      document.getElementById('verovio').innerHTML = svg
    }
  }, [currentPage])

  useEffect(() => {
    loadScore()
  }, [meiUrl])

  return (
    <>
      {window.tk && (
        <>
          <button
            onClick={e => {
              if (currentPage >= 2) setCurrentPage(currentPage - 1)
            }}
          >
            previous
          </button>
          <button>
            {currentPage}/{pageCount}
          </button>
          <button
            onClick={e => {
              if (currentPage < pageCount) setCurrentPage(currentPage + 1)
            }}
          >
            next
          </button>
        </>
      )}
      <div css={verovioStyle} id="verovio" />
    </>
  )
}
