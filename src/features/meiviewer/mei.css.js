import { css } from '@emotion/react'

export const COLOR_FOCUSED = 'grey'
export const COLOR_SELECTED = 'red'
export const COLOR_INSPECTED = 'blue'

// standard classes

export const centerStyle = theme => css`
  display: flex;
  justify-content: center;
  margin: 16px;
`

export const flexEndStyle = theme => css`
  display: flex;
  justify-content: space-between;
  padding-bottom: 16px;
`

// specific classes

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

export const verovioStyle = css`
  min-height: 100vh;

  .vrv-ui-toolbar {
    font-family: 'Roboto';
    .vrv-ui-btn-group {
      display: flex;
      justify-content: center;
    }
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

export const panelStyle = theme => css`
  font-family: 'Roboto';
  border-left: 1px solid lightgray;
  width: 30%;
  display: grid;
  grid-auto-rows: 50vh;
`

export const noDataStyle = theme => css`
  text-align: center;
  font-size: small;
  color: grey;
  margin: 16px;
`
