import { useEffect } from 'react'

export const StyleNote = ({ noteId, currentPage, scale, pageCount }) => {
  const note = document.getElementById(noteId)

  useEffect(() => {
    note?.classList.add('selected')
    return () => note?.classList.remove('selected')
  }, [note, currentPage, scale, pageCount])

  return null
}
