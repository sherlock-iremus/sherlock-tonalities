import { useState, useEffect } from 'react'

export const useDailyRender = (key = 'lastRenderDate') => {
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const lastRender = localStorage.getItem(key)

    if (lastRender !== today) {
      setShouldRender(true)
    }
  }, [key])

  const onClose = () => {
    const today = new Date().toISOString().split('T')[0]
    localStorage.setItem(key, today)
    setShouldRender(false)
  }

  return { shouldRender, onClose }
}
