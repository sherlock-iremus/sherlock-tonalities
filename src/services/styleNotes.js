import { useEffect } from 'react'

const notes = new Map()
let isInitialized = false

const registerStyleNote = (noteId, className) => {
  const el = document.getElementById(noteId)
  if (el) {
    notes.set(noteId, { el, className })
    ensureListeners()
  }
}

const unregisterStyleNote = noteId => {
  const note = notes.get(noteId)
  if (note) {
    note.el.classList.remove(note.className)
    notes.delete(noteId)
  }
}

const ensureListeners = () => {
  if (isInitialized) return
  isInitialized = true
  document.addEventListener('mousemove', handleMouseMove)
}

const handleMouseMove = e => {
  for (const { el, className } of notes.values()) {
    const isInside = el.contains(e.target)
    el.classList.toggle(className, isInside)
  }
}

export const useStyleNotes = (noteIds, className) => {
  useEffect(() => {
    noteIds.forEach(id => registerStyleNote(id, className))
    return () => noteIds.forEach(id => unregisterStyleNote(id))
  }, [noteIds, className])
}
