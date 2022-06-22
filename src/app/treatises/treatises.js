// import new treatises here
import Zarlino_1588 from './Zarlino_1588.json'
import My_Treaty from './My_Treaty.json'
import Proetorius_1619 from './Praetorius_1619.json'

// include treatiseIris in array
export const treatiseList = [Zarlino_1588.iri, My_Treaty.iri, Proetorius_1619.iri]

// include treatise in object
const treatises = {
  [Zarlino_1588.iri]: Zarlino_1588,
  [My_Treaty.iri]: My_Treaty,
  [Proetorius_1619.iri]: Proetorius_1619,
}

export const getTreatise = treatiseIri => treatises[treatiseIri]
