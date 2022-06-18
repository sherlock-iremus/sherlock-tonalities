import Zarlino_1588 from './Zarlino_1588.json'
// import new treatises here

export const treatiseList = [Zarlino_1588.iri] // include treatiseIri in array
const treatises = { Zarlino_1588 } // include treatise in object

export const getTreatise = treatiseIri => treatises[treatiseIri]
