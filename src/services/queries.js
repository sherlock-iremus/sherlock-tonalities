export const getAnnotations = (scoreIri, projectIri) => `
PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
PREFIX sherlock: <http://data-iremus.huma-num.fr/ns/sherlock#>
PREFIX dcterms: <http://purl.org/dc/terms/>

SELECT * FROM <http://data-iremus.huma-num.fr/graph/sherlock>
WHERE {
    <${projectIri}> crm:P9_consists_of ?annotation.
    ?annotation sherlock:has_document_context ?page.
    FILTER CONTAINS(str(?page), "${scoreIri}").
    ?annotation crm:P141_assigned ?entity.
    ?annotation dcterms:created ?date.
    ?entity dcterms:creator ?author.
}
`

export const getContributor = contributorIri => `
PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
PREFIX analysis: <http://modality-tonality.huma-num.fr/analysisOntology#>
SELECT ?contributor ?color ?emoji ?program
FROM <http://data-iremus.huma-num.fr/graph/users>
WHERE {
    VALUES ?contributor { <${contributorIri}> }
    
    OPTIONAL { ?contributor analysis:hasPythonModuleName ?program }
    OPTIONAL {
        ?contributor crm:P1_is_identified_by ?unicode.
        ?unicode crm:P2_has_type <http://data-iremus.huma-num.fr/id/04242f64-fbb3-4b5b-bb2e-3ddd59eeea18>.
        ?unicode crm:P190_has_symbolic_content ?emoji.
        ?contributor crm:P1_is_identified_by ?hexcode.
        ?hexcode crm:P2_has_type <http://data-iremus.huma-num.fr/id/5f1bb74f-6ea0-4073-8b68-086f98454f1c>.
        ?hexcode crm:P190_has_symbolic_content ?color.
    }
}`

export const getAnalyticalProject = analyticalProjectIri => `
PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
PREFIX sherlock: <http://data-iremus.huma-num.fr/ns/sherlock#>
SELECT * FROM <http://data-iremus.huma-num.fr/graph/sherlock>
WHERE {
    VALUES ?project { <${analyticalProjectIri}> }
    VALUES ?draft { <${DRAFT_PROJECT}> }
    ?project crm:P2_has_type <${ANALYTICAL_PROJECT}>.
    ?project crm:P1_is_identified_by ?label.
    ?project crm:P14_carried_out_by ?contributor.
    OPTIONAL { ?project sherlock:has_privacy_type ?draft }.
}
LIMIT 1`

export const getP140 = e13 => `
PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
SELECT * FROM <http://data-iremus.huma-num.fr/graph/sherlock>
WHERE { <${e13}> crm:P140_assigned_attribute_to ?p140 }
`

export const getAssignments= analyticalEntityIri => `
PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
PREFIX dcterms: <http://purl.org/dc/terms/>

SELECT * FROM <http://data-iremus.huma-num.fr/graph/sherlock>
WHERE {
    ?assignment crm:P140_assigned_attribute_to <${analyticalEntityIri}>.
    ?assignment crm:P141_assigned ?p141.
    ?assignment dcterms:created ?date.
    ?assignment dcterms:creator ?author.
    OPTIONAL { ?p141 crm:P2_has_type ?type }.
}
`

export const getProjects = scoreIri => `
PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
PREFIX sherlock: <http://data-iremus.huma-num.fr/ns/sherlock#>
SELECT ?project (COUNT(?annotation) AS ?annotations) (SAMPLE(?name) AS ?label)
FROM <http://data-iremus.huma-num.fr/graph/sherlock>
WHERE { 
    ?annotation sherlock:has_document_context <${scoreIri}>.
    ?project crm:P9_consists_of ?annotation.
    ?project crm:P1_is_identified_by ?name
 }
 GROUP BY ?project
`

export const NOTE = 'http://data-iremus.huma-num.fr/id/d2a536eb-4a95-484f-b13d-f597ac8ea2fd'
export const SELECTION = 'http://data-iremus.huma-num.fr/id/9d0388cb-a178-46b2-b047-b5a98f7bdf0b'
export const POSITIONNED_NOTE = 'http://data-iremus.huma-num.fr/id/689e148d-a97d-45b4-898d-c395a24884df'
export const VERTICALITY = 'http://data-iremus.huma-num.fr/id/90a2ae1e-0fbc-4357-ac8a-b4b3f2a06e86'
export const ANALYTICAL_ENTITY = 'http://data-iremus.huma-num.fr/id/6d72746a-9f28-4739-8786-c6415d53c56d'
export const SCORE = 'http://data-iremus.huma-num.fr/id/bf9dce29-8123-4e8e-b24d-0c7f134bbc8e'
export const SOFTWARE = 'http://data-iremus.huma-num.fr/id/29b00e39-75da-4945-b6c4-a0ca00f96f68'
export const ANNOTATION = 'http://data-iremus.huma-num.fr/id/82dbd157-20df-422c-88db-28d6075d99a1'
export const ANALYTICAL_PROJECT = 'http://data-iremus.huma-num.fr/id/21816195-6708-4bbd-a758-ee354bb84900'
export const DRAFT_PROJECT = 'http://data-iremus.huma-num.fr/id/cabe46bf-23d4-4392-aa20-b3eb21ad7dfd'