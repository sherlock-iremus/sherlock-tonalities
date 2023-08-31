import { ANALYTICAL_ENTITY } from './services/queries'

export const createEntity = async ({ selectedNotes, scoreIri, projectIri, postAnnotation }) => {
  try {
    const offsets = selectedNotes.map(note => window.tk.getTimeForElement(note))
    const firstNote = selectedNotes[offsets.findIndex(e => e === Math.min(...offsets))]
    const page = window.tk.getPageWithElement(firstNote)

    const body = {
      p140: selectedNotes.map(note => scoreIri + '_' + note),
      p177: 'crm:P67_refers_to',
      new_p141: { rdf_type: ['crm:E28_Conceptual_Object'], p2_type: [ANALYTICAL_ENTITY] },
      p141_type: 'new resource',
      document_context: scoreIri + '_' + page,
      analytical_project: projectIri,
    }

    const response = await postAnnotation(body).unwrap()
    const entity = response.find(e => e['@type']?.includes('http://www.cidoc-crm.org/cidoc-crm/E28_Conceptual_Object'))
    return entity['@id']
  } catch (error) {
    console.log(error)
  }
}

export const assignConcept = async ({ entityIri, conceptIri, scoreIri, projectIri, postAnnotation }) => {
  try {
    const body = {
      p140: entityIri,
      p177: 'crm:P2_has_type',
      p141: conceptIri,
      p141_type: 'uri',
      document_context: scoreIri,
      analytical_project: projectIri,
    }
    const response = await postAnnotation(body).unwrap()
    const annotation = response.find(e =>
      e['@type']?.includes('http://www.cidoc-crm.org/cidoc-crm/E13_Attribute_Assignment')
    )
    return annotation['@id']
  } catch (error) {
    console.log(error)
  }
}

export const assignArbitraryText = async ({ entityIri, input, scoreIri, projectIri, postAnnotation }) => {
  try {
    const body = {
      p140: entityIri,
      p177: 'crm:P2_has_type',
      p141: input,
      p141_type: 'literal',
      document_context: scoreIri,
      analytical_project: projectIri,
    }
    const response = await postAnnotation(body).unwrap()
    const annotation = response.find(e =>
      e['@type']?.includes('http://www.cidoc-crm.org/cidoc-crm/E13_Attribute_Assignment')
    )
    return annotation['@id']
  } catch (error) {
    console.log(error)
  }
}

export const assignSubEntity = async ({ parentEntity, childEntity, predicate, scoreIri, projectIri, postAnnotation }) => {
  try {
    const body = {
      p140: parentEntity,
      p177: predicate,
      p141: childEntity,
      p141_type: 'uri',
      document_context: scoreIri,
      analytical_project: projectIri,
    }
    const response = await postAnnotation(body).unwrap()
    const annotation = response.find(e =>
      e['@type']?.includes('http://www.cidoc-crm.org/cidoc-crm/E13_Attribute_Assignment')
    )
    return annotation['@id']
  } catch (error) {
    console.log(error)
  }
}