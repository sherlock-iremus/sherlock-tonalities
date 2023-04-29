import { useEffect } from 'react'

export const StyleNote = ({ noteId, currentPage, scale, pageCount, className }) => {
  const note = document.getElementById(noteId)

  useEffect(() => {
    note?.classList.add(className)
    return () => note?.classList.remove(className)
  }, [note, currentPage, scale, pageCount, className])

  return null
}
