import { useEffect } from 'react'

export const StyleNote = ({ noteId }) => {
  const note = document.getElementById(noteId)
  console.log(noteId)

  useEffect(() => {
    note?.classList.add('selected')
    return () => note?.classList.remove('selected')
  }, [note])

  return null
}
