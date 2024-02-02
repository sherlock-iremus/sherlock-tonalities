import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import models from '../config/models.json'

const baseUrl =
  'https://raw.githubusercontent.com/polifonia-project/music-analysis-ontology/main/annotationModels/JSON/'

export const model = createApi({
  reducerPath: 'model',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: builder => ({
    getModel: builder.query({
      query: index => ({ url: models[index].filename }),
      transformResponse: response => {
        const classes = response.filter(c => c['@type'].includes('http://www.w3.org/2002/07/owl#Class'))
        const classesIri = classes.map(c => c['@id'])
        const classesWithParent = classes.map(c => {
          const isDisabled = !!c['http://data-iremus.huma-num.fr/ns/sherlock#musicAnnotationConcept']
          const parent = c['http://www.w3.org/2000/01/rdf-schema#subClassOf']?.find(p =>
            classesIri.includes(p['@id'])
          )?.['@id']
          return { iri: c['@id'], ...(parent && { parent }), ...(isDisabled && { isDisabled }) }
        })
        const rootClasses = classesWithParent.filter(c => !c.parent)

        const getSubClasses = iri => classesWithParent.filter(c => c.parent === iri).map(c => createNode(c))

        const createNode = ({ iri, isDisabled }) => {
          const subClasses = getSubClasses(iri)
          return { iri, ...(subClasses.length && { subClasses }), ...(isDisabled && { isDisabled }) }
        }
        return rootClasses.map(c => createNode(c))
      },
    }),
  }),
})

export default model

export const { useGetModelQuery } = model
