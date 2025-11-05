import { useState, useEffect } from 'react'

export const useHover = (ref, throttleMs = 16) => {
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    let last = 0

    const handleMouseMove = event => {
      if (!ref.current) return
      const now = performance.now()
      if (now - last < throttleMs) return
      last = now

      const rect = ref.current.getBoundingClientRect()
      const { clientX: x, clientY: y } = event
      const inside = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom

      setIsHovered(inside)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [throttleMs])

  return isHovered
}
