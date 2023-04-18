import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { removeBaseIri } from '../../utils'

export const ontologies = createApi({
  reducerPath: 'ontologies',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://raw.githubusercontent.com/polifonia-project/modal-tonal-ontology/main/otherModels/JSON/',
  }),
  endpoints: builder => ({
    getCadencesGuillotel: builder.query({
      query: () => ({ url: 'cadences_Guillotel.json' }),
      transformResponse: response => {
        const classes = response.filter(c => c['@type'].includes('http://www.w3.org/2002/07/owl#Class'))
        const classesIri = classes.map(c => c['@id'])
        const classesWithParent = classes.map(c => {
          const parent = c['http://www.w3.org/2000/01/rdf-schema#subClassOf']?.find(p =>
            classesIri.includes(p['@id'])
          )?.['@id']
          return { iri: c['@id'], ...(parent && { parent }) }
        })
        const rootClasses = classesWithParent.filter(c => !c.parent)

        const getSubClasses = iri => classesWithParent.filter(c => c.parent === iri).map(c => createNode(c.iri))

        const createNode = iri => {
          const subClasses = getSubClasses(iri)
          return { iri: removeBaseIri(iri), ...(subClasses.length && { subClasses }) }
        }
        return rootClasses.map(c => createNode(c.iri))
      },
    }),
  }),
})

export default ontologies

export const { useGetCadencesGuillotelQuery } = ontologies
