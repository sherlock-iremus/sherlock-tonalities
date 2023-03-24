import { Dialog, DialogContent, DialogContentText, DialogTitle } from '@mui/material'

export const MobileInfo = () => (
  <Dialog open>
    <DialogTitle>Tonalities is not yet compatible with mobiles</DialogTitle>
    <DialogContent>
      <DialogContentText>Please switch to a wider screen to use Tonalities</DialogContentText>
    </DialogContent>
  </Dialog>
)
