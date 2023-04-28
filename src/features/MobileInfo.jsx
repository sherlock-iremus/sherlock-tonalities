/* eslint-disable react-hooks/exhaustive-deps */
import { Dialog, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const MobileInfo = () => {
  const navigate = useNavigate()

  useEffect(() => {
    if (window.innerWidth > 600) navigate(0)
  }, [])

  return (
    <Dialog open>
      <DialogTitle>Tonalities is not yet compatible with mobiles</DialogTitle>
      <DialogContent>
        <DialogContentText>Please switch to a wider screen to use Tonalities</DialogContentText>
      </DialogContent>
    </Dialog>
  )
}
