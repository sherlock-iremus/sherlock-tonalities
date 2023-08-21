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

export const getUuid = iri => iri.split('/').pop()

export const removeBaseIri = iri => iri.split('#').pop()

export const getPage = iri => Number(iri.split('_').pop())

export const getId = iri => iri.split('_').pop()

export const getIri = uuid => `http://data-iremus.huma-num.fr/id/${uuid}`

export const getModelGeneric = iri => iri.split('/').pop().split('_').shift()

export const getModel = iri =>
  (iri.includes('Praetorius') && 'Praetorius 1619') ||
  (iri.includes('Polifonia') && 'Zarlino 1558') ||
  (iri.includes('Guillotel') && 'Guillotel 2022')

export const createUuid = () => URL.createObjectURL(new Blob([])).slice(-36)
