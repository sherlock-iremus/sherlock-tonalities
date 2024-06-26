import { blue, brown, deepOrange, deepPurple, indigo, pink, purple, red, teal } from '@mui/material/colors'

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

export const removeBaseIri = iri => (iri ? (iri.includes('#') ? iri.split('#').pop() : iri.split('/').pop()) : '')

export const getId = iri => iri.split('#').pop()

export const getIri = uuid => `http://data-iremus.huma-num.fr/id/${uuid}`

export const getModelGeneric = iri => iri.split('/').pop().split('_').shift()

export const getModel = iri =>
  (iri?.toLowerCase().includes('praetorius') && 'Praetorius 1619') ||
  (iri?.toLowerCase().includes('filaber') && 'Cadences (Renaissance)') ||
  (iri?.toLowerCase().includes('modal-tonal') && 'Zarlino 1558') ||
  (iri?.toLowerCase().includes('guillotel') && 'Guillotel 2022') ||
  (iri?.toLowerCase().includes('fugue') && 'Fugue') ||
  (iri?.toLowerCase().includes('textmusic') && 'Text-Music Relations') ||
  (iri?.toLowerCase().includes('zarlino') && 'Zarlino') ||
  (iri?.toLowerCase().includes('interpretation') && 'Interpretation') ||
  (iri?.toLowerCase().includes('chordscommonpractice') && 'Chords: common practice harmony') ||
  (iri?.toLowerCase().includes('lullyCadences') && 'Cadences (17th Century)') ||
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
  'Lully/Persee': 'Jean-Baptiste Lully',
  Morales: 'Cristobal de Morales',
  Praetorius: 'Michael Prætorius',
  Verdelot: 'Philippe Verdelot',
  Willaert: 'Adrian Willaert',
  Zarlino: 'Gioseffo Zarlino',
}

export const createUuid = () => URL.createObjectURL(new Blob([])).slice(-36)

export const colors = [blue, brown, deepOrange, deepPurple, indigo, pink, purple, red, teal]
