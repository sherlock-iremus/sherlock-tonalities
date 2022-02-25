import { css } from '@emotion/react'
import { COLOR_FOCUS, COLOR_HOVER } from './constants'

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
  }

  .hovered {
    fill: ${COLOR_HOVER};
    stroke: ${COLOR_HOVER};
    cursor: pointer;
  }

  g.selected {
    fill: ${COLOR_FOCUS};
  }

  g.focused {
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

export const selectionStyle = theme => css`
  &:hover {
    color: ${COLOR_HOVER};
    cursor: pointer;
  }
`

export const noDataStyle = theme => css`
  text-align: center;
  font-size: x-small;
  color: grey;
`