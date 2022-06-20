import Zarlino_1588 from './Zarlino_1588.json'
import My_Treaty from './My_Treaty.json'
// import new treatises here

export const treatiseList = [Zarlino_1588.iri, My_Treaty.iri] // include treatiseIri in array
const treatises = { [Zarlino_1588.iri]: Zarlino_1588, [My_Treaty.iri]: My_Treaty } // include treatise in object

export const getTreatise = treatiseIri => treatises[treatiseIri]
