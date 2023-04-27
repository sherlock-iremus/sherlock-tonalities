import { createTheme } from '@mui/material'
import { grey, blueGrey } from '@mui/material/colors'

export const PRIMARY_COLOR = blueGrey[500]

export const theme = createTheme({
  palette: {
    primary: { main: PRIMARY_COLOR },
    text: { main: grey[500] },
  },
})
