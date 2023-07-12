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
