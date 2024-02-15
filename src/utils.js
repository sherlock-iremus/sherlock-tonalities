import { blue, blueGrey, brown, deepOrange, deepPurple, indigo, pink, purple, red, teal } from '@mui/material/colors'

export const stringToColor = string => {
  /* eslint-disable no-bitwise */
  let hash = 0
  let color = '#'
  let i
  for (i = 0; i < string.length; i += 1) hash = string.charCodeAt(i) + ((hash << 5) - hash)
  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff
    color += `00${value.toString(16)}`.slice(-2)
  }
  /* eslint-enable no-bitwise */
  return color
}

export const getUuid = iri => iri.split('/').pop()

export const removeBaseIri = iri => (iri.includes('#') ? iri.split('#').pop() : iri.split('/').pop())

export const getId = iri => iri.split('#').pop()

export const getIri = uuid => `http://data-iremus.huma-num.fr/id/${uuid}`

export const getModelGeneric = iri => iri.split('/').pop().split('_').shift()

export const getModel = iri =>
  (iri?.includes('raetorius') && 'Praetorius 1619') ||
  (iri?.includes('ilaber') && 'Cadences (Renaissance)') ||
  (iri?.includes('modal-tonal') && 'Zarlino 1558') ||
  (iri?.includes('uillotel') && 'Guillotel 2022') ||
  (iri?.includes('ugue') && 'Fugue') ||
  (iri?.includes('TextMusic') && 'Text-Music Relations') ||
  (iri?.includes('zarlino') && 'Zarlino') ||
  (iri?.includes('nterpretation') && 'Interpretation') ||
  ''

export const composers = {
  Anonyme: 'Anonyme',
  Dufay: 'Guillaume Dufay',
  'Bach/Bach_Chorals': 'Johann Sebastian Bach',
  //'Bach/Bach_Fugues': 'Johann Sebastian Bach',
  De_Mantua: 'Jacquet de Mantua',
  De_Rore: 'Cyprien de Rore',
  DeLaRue: 'Pierre de La Rue',
  Dufay: 'Guillaume Dufay',
  Fontanelli: 'Alfonso Fontanelli',
  Gombert: 'Nicolas Gombert',
  Hellinck: 'Lupus Hellinck',
  Isaac: 'Heinrich Isaac',
  'Josquin/Josquin_Chansons': 'Josquin des Prez',
  //'Josquin/Josquin_Sacred_Music': 'Josquin des Prez',
  Lechner: 'Leonhard Lechner',
  Morales: 'Cristobal de Morales',
  Praetorius: 'Michael Prætorius',
  Verdelot: 'Philippe Verdelot',
  Willaert: 'Adrian Willaert',
  Zarlino: 'Gioseffo Zarlino',
}

export const createUuid = () => URL.createObjectURL(new Blob([])).slice(-36)

export const timeSince = date => {
  let seconds = Math.floor((new Date() - date) / 1000)
  let interval = seconds / 31536000
  if (interval > 1) return Math.floor(interval) + ' years'
  interval = seconds / 2592000
  if (interval > 1) return Math.floor(interval) + ' months'
  interval = seconds / 86400
  if (interval > 1) return Math.floor(interval) + ' days'
  interval = seconds / 3600
  if (interval > 1) return Math.floor(interval) + ' hours'
  interval = seconds / 60
  if (interval > 1) return Math.floor(interval) + ' minutes'
  return Math.floor(seconds) + ' seconds'
}

const extractSparql = obj => Object.fromEntries(Object.entries(obj).map(([key, { value }]) => [key, value]))

export const colors = [blue, blueGrey, brown, deepOrange, deepPurple, indigo, pink, purple, red, teal]
