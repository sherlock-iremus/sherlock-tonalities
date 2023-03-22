import { css } from '@emotion/react'
import { red } from '@mui/material/colors'

export const COLOR_FOCUSED = red[700]
export const COLOR_SELECTED = red[700]
export const COLOR_INSPECTED = red[700]

export const verovioStyle = css`
  .focused {
    fill: ${COLOR_FOCUSED};
    stroke: ${COLOR_FOCUSED};
    cursor: pointer;
  }
  .selected {
    fill: ${COLOR_SELECTED};
    stroke: ${COLOR_SELECTED};
    cursor: pointer;
  }
  .inspected {
    fill: ${COLOR_INSPECTED};
    stroke: ${COLOR_INSPECTED};
    cursor: pointer;
  }
  svg {
    align-self: center;
  }
`
export const verovio = {
  focused: {
    fill: COLOR_FOCUSED,
    stroke: COLOR_FOCUSED,
    cursor: 'pointer',
  },
  selected: {
    fill: COLOR_SELECTED,
    stroke: COLOR_SELECTED,
    cursor: 'pointer',
  },
  inspected: {
    fill: COLOR_INSPECTED,
    stroke: COLOR_INSPECTED,
    cursor: 'pointer',
  },
}
