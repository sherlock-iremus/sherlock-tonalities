import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { DEV_ENV } from './service'
import models from '../config/models.json'
import { removeBaseIri } from '../utils'

const baseUrl = DEV_ENV
  ? 'https://raw.githubusercontent.com/felix-commits/modal-tonal-ontology/patch-2/otherModels/JSON/'
  : 'https://raw.githubusercontent.com/polifonia-project/modal-tonal-ontology/main/otherModels/JSON/'

export const model = createApi({
  reducerPath: 'model',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: builder => ({
    getModel: builder.query({
      query: index => ({ url: models[index].filename }),
      transformResponse: response => {
        const classes = response
          .filter(c => c['@type'].includes('http://www.w3.org/2002/07/owl#Class'))
          .filter(c => c['@id'].includes('#'))
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

export default model

export const { useGetModelQuery } = model
