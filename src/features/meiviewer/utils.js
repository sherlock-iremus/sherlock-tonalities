import { useEffect, useRef } from 'react'

export const sameMembers = (selection, otherSelection) => {
  const set = new Set(selection)
  const otherSet = new Set(otherSelection)
  return selection.every(item => otherSet.has(item)) && otherSelection.every(item => set.has(item))
}

export const usePrevious = value => {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}