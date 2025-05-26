import { ANALYTICAL_ENTITY } from './services/queries'

export const createEntity = async ({ selectedNotes, scoreIri, projectIri, postAnnotation }) => {
  try {
    const isGlobalAnnotation = selectedNotes.includes(scoreIri)

    const body = {
      p140: isGlobalAnnotation ? [scoreIri] : selectedNotes.map(note => scoreIri + '#' + note),
      p177: 'crm:P67_refers_to',
      new_p141: { rdf_type: ['crm:E28_Conceptual_Object'], p2_type: [ANALYTICAL_ENTITY] },
      p141_type: 'NEW_RESOURCE',
      document_context: scoreIri,
      analytical_project: projectIri,
      contribution_graph: 'tonalities-contributions',
    }

    const response = await postAnnotation(body).unwrap()
    const entity = response.find(e => e['@type']?.includes('http://www.cidoc-crm.org/cidoc-crm/E28_Conceptual_Object'))
    return entity['@id']
  } catch (error) {
    console.error(error)
  }
}

export const updateEntity = async ({ selectedNotes, entityIri, scoreIri, projectIri, postAnnotation }) => {
  try {
    const body = {
      p140: selectedNotes.map(note => scoreIri + '#' + note),
      p177: 'crm:P67_refers_to',
      p141: entityIri,
      p141_type: 'URI',
      document_context: scoreIri,
      analytical_project: projectIri,
      contribution_graph: 'tonalities-contributions',
    }

    const response = await postAnnotation(body).unwrap()
    const annotation = response.find(e =>
      e['@type']?.includes('http://www.cidoc-crm.org/cidoc-crm/E13_Attribute_Assignment')
    )
    return annotation['@id']
  } catch (error) {
    console.error(error)
  }
}

export const assignConcept = async ({ entityIri, conceptIri, scoreIri, projectIri, postAnnotation }) => {
  try {
    const body = {
      p140: [entityIri],
      p177: 'crm:P2_has_type',
      p141: conceptIri,
      p141_type: 'URI',
      document_context: scoreIri,
      analytical_project: projectIri,
      contribution_graph: 'tonalities-contributions',
    }
    const response = await postAnnotation(body).unwrap()
    const annotation = response.find(e =>
      e['@type']?.includes('http://www.cidoc-crm.org/cidoc-crm/E13_Attribute_Assignment')
    )
    return annotation['@id']
  } catch (error) {
    console.error(error)
  }
}

export const assignArbitraryText = async ({ entityIri, input, scoreIri, projectIri, postAnnotation }) => {
  try {
    const body = {
      p140: [entityIri],
      p177: 'crm:P2_has_type',
      p141: input,
      p141_type: 'LITERAL',
      document_context: scoreIri,
      analytical_project: projectIri,
      contribution_graph: 'tonalities-contributions',
    }
    const response = await postAnnotation(body).unwrap()
    const annotation = response.find(e =>
      e['@type']?.includes('http://www.cidoc-crm.org/cidoc-crm/E13_Attribute_Assignment')
    )
    return annotation['@id']
  } catch (error) {
    console.error(error)
  }
}

export const assignSubEntity = async ({ parentEntity, childEntity, scoreIri, projectIri, postAnnotation }) => {
  try {
    const body = {
      p140: [parentEntity],
      p177: 'crm:P106_is_composed_of',
      p141: childEntity,
      p141_type: 'URI',
      document_context: scoreIri,
      analytical_project: projectIri,
      contribution_graph: 'tonalities-contributions',
    }
    const response = await postAnnotation(body).unwrap()
    const annotation = response.find(e =>
      e['@type']?.includes('http://www.cidoc-crm.org/cidoc-crm/E13_Attribute_Assignment')
    )
    return annotation['@id']
  } catch (error) {
    console.error(error)
  }
}
