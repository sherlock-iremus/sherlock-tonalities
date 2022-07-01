import { css } from '@emotion/react'
import { blue, grey, red } from '@mui/material/colors'

export const COLOR_FOCUSED = grey[600]
export const COLOR_SELECTED = red[700]
export const COLOR_INSPECTED = blue[800]
export const COLOR_NAVIGATE = grey[600]

export const mainAreaStyle = css`
  background-color: white;
  cursor: default;
  width: 70%;
`

export const verovioStyle = css`
  min-height: 100vh;
  
  .vrv-ui-toolbar {
    font-family: 'Roboto';
  }

  .vrv-ui-doc-wrapper {
    width: 100% !important;
  }

  .vrv-ui-view {
    width: 100% !important;
  }

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
`
