import { Palette } from '@mui/icons-material'
import { SpeedDial, SpeedDialAction } from '@mui/material'
import {
  blue,
  blueGrey,
  brown,
  deepOrange,
  deepPurple,
  grey,
  indigo,
  pink,
  purple,
  red,
  teal,
} from '@mui/material/colors'
import { useDispatch } from 'react-redux'
import { setColorIndex } from '../services/globals'

export const colors = [
  //amber
  blue,
  blueGrey,
  brown,
  //cyan
  deepOrange,
  deepPurple,
  //green
  grey,
  indigo,
  //lightBlue
  //lightGreen
  //lime
  //orange
  pink,
  purple,
  red,
  teal,
]

export const ThemePicker = () => {
  const dispatch = useDispatch()
  return (
    <SpeedDial
      sx={{
        position: 'absolute',
        bottom: 16,
        left: 16,
        '& .MuiSpeedDial-fab': {
          width: 40,
          height: 40,
        },
      }}
      ariaLabel="theme"
      icon={<Palette />}
    >
      {colors.map((color, index) => (
        <SpeedDialAction
          key={index}
          sx={{ backgroundColor: color[500] }}
          onClick={() => dispatch(setColorIndex(index))}
        />
      ))}
    </SpeedDial>
  )
}
