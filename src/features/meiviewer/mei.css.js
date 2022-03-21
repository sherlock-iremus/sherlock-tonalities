import { css } from '@emotion/react'

export const COLOR_FOCUSED = 'grey'
export const COLOR_SELECTED = 'blue'
export const COLOR_INSPECTED = 'red'
export const COLOR_INSPECTED_LIGHT = '#ff8080'

export const containerStyle = css`
  display: flex;

  @keyframes condemed_blink_effect {
    0% {
      fill: aqua;
    }
    100% {
      fill: black;
    }
  }
`

export const mainAreaStyle = css`
  background-color: white;
  cursor: default;
  width: 70%;
`

export const modeSelectorStyle = css`
  border-bottom: 1px solid black;
`

export const verovioStyle = css`
  min-height: 100vh;

  .vrv-ui-toolbar {
    font-family: 'Roboto';
    .vrv-ui-btn-view-selector {
      visibility: hidden;
    }
    .vrv-ui-separator {
      visibility: hidden;
    }
    .vrv-ui-btn-previous {
      visibility: hidden;
    }
    .vrv-ui-btn-next {
      visibility: hidden;
    }
    .vrv-ui-btn-group {
      display:flex;
      justify-content: flex-end;
    }
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

  g.focused.old {
    animation: 0.3s linear infinite condemed_blink_effect;
  }
`

export const panelStyle = theme => css`
  font-family: 'Roboto';
  border-left: 1px solid lightgray;
  width: 30%;
  padding: 8px;
`

export const toggleButtonStyle = theme => css`
  display: flex;
  justify-content: center;
`
export const rowStyle = theme => css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const flexEndStyle = theme => css`
  display: flex;
  justify-content: end;
`

export const scoreSelectionStyle = theme => css`
  &:hover {
    color: ${COLOR_FOCUSED};
    cursor: pointer;
  }
`

export const noDataStyle = theme => css`
  text-align: center;
  font-size: x-small;
  color: grey;
`
