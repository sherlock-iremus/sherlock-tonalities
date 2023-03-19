import { createTheme } from '@mui/material'
import { grey, red } from '@mui/material/colors'

export const theme = createTheme({
  palette: {
    primary: {
      main: red[500],
    },
    text: {
      main: grey[500],
    },
  },
})
