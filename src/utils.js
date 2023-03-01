import { ANALYTICAL_ENTITY, ANNOTATION, NOTE, POSITIONNED_NOTE, SCORE, SELECTION, VERTICALITY } from './features/score/constants'
import scores from './app/scores.json'

export const findKey = item =>
  item &&
  (item.noteIri ||
    item.verticalityIri ||
    item.positionnedNoteIri ||
    item.selectionIri ||
    item.conceptIri ||
    item.propertyIri ||
    item.annotationIri ||
    item.analyticalEntityIri ||
    item.contributorIri ||
    item.scoreIri)

export const findType = ({
  noteIri,
  verticalityIri,
  positionnedNoteIri,
  selectionIri,
  scoreIri,
  analyticalEntityIri,
  annotationIri,
}) =>
  (noteIri && NOTE) ||
  (verticalityIri && VERTICALITY) ||
  (positionnedNoteIri && POSITIONNED_NOTE) ||
  (selectionIri && SELECTION) ||
  (analyticalEntityIri && ANALYTICAL_ENTITY) ||
  (scoreIri && SCORE) ||
  (annotationIri && ANNOTATION)

export const sleep = time => new Promise(resolve => setTimeout(resolve, time))

export const stringToColor = string => {
  let hash = 0
  let i

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) hash = string.charCodeAt(i) + ((hash << 5) - hash)

  let color = '#'

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff
    color += `00${value.toString(16)}`.slice(-2)
  }
  /* eslint-enable no-bitwise */

  return color
}

export const getScoreLabel = scoreIri => {
  for (const score of scores) if (scoreIri.match(score.scoreIri)) return score.scoreTitle
  return null
}

export const getUuidFromSherlockIri = iri => iri.split('/').pop()

export const getSherlockIriFromUuid = uuid => `http://data-iremus.huma-num.fr/id/${uuid}`

/**
 *
 * @param {array} x
 * @param {func} f Function that returns true if element should be grouped
 * @returns
 */
export const concatAnalyticalEntities = (x, f) =>
  x.reduce((a, b) => {
    const selection = a.find(e => f(e, b))
    selection
      ? selection.analyticalEntitiesTypes.push(b.analyticalEntity_type?.value)
      : a.push({ analyticalEntitiesTypes: [b.analyticalEntity_type?.value], ...b })
    return a
  }, [])
