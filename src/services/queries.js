export const getCollaborativeIndividuals = projectIri => `
PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
PREFIX sherlock: <http://data-iremus.huma-num.fr/ns/sherlock#>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX iremus: <http://data-iremus.huma-num.fr/id/>

SELECT ?individual (GROUP_CONCAT(DISTINCT ?name; SEPARATOR=", ") AS ?authors) (GROUP_CONCAT(DISTINCT ?note; SEPARATOR=", ") AS ?notes)
FROM <http://data-iremus.huma-num.fr/graph/tonalities-contributions>
FROM <http://data-iremus.huma-num.fr/graph/users>
WHERE {
   	${projectIri} crm:P9_consists_of ?assignment.
    ?assignment crm:P177_assigned_property_of_type crm:P2_has_type.
    ?assignment crm:P140_assigned_attribute_to ?individual.
  	?link crm:P141_assigned ?individual.
  	?link crm:P140_assigned_attribute_to ?noteUri.
    BIND(STRAFTER(STR(?noteUri), "#") AS ?note)
  	?assignment dcterms:creator ?creator.
  	?creator crm:P1_is_identified_by ?identifier.
    ?identifier crm:P2_has_type iremus:73ea8d74-3526-4f6a-8830-dd369795650d.
    ?identifier crm:P190_has_symbolic_content ?name.
}
GROUP BY ?individual
HAVING (COUNT(DISTINCT ?creator) > 1)
`

export const getExternalAnnotations = projectIri => `
PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
PREFIX iremus: <http://data-iremus.huma-num.fr/id/>
SELECT ?assignment ?contributor ?individual
FROM <http://data-iremus.huma-num.fr/graph/tonalities-contributions>
WHERE {
    VALUES ?project { ${projectIri} }
   	?project crm:P14_carried_out_by ?creator.
   	?project crm:P9_consists_of ?assignment.
    ?assignment crm:P177_assigned_property_of_type crm:P2_has_type.
    ?assignment crm:P140_assigned_attribute_to ?individual.
    ?assignment crm:P14_carried_out_by ?contributor.
    FILTER (?creator != ?contributor)
}
`

export const getAnnotations = projectIri => `
PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
PREFIX dcterms: <http://purl.org/dc/terms/>
SELECT ?entity ?annotation ?date ?author ?noteId ?notes
FROM <http://data-iremus.huma-num.fr/graph/tonalities-contributions>
WHERE {
    {
        SELECT ?entity (MAX(?dates) AS ?date) (SAMPLE(?note) AS ?noteId) (COUNT(?note) AS ?notes)
        WHERE {
            <${projectIri}> crm:P9_consists_of ?annotation.

            ?annotation crm:P177_assigned_property_of_type crm:P67_refers_to ;
                crm:P140_assigned_attribute_to ?note ;
                crm:P141_assigned ?entity ;
                dcterms:created ?dates.

            NOT EXISTS {
                ?supAnnotation crm:P141_assigned ?entity ;
                    crm:P177_assigned_property_of_type crm:P106_is_composed_of.
            }
        }
        GROUP BY ?entity
    }
    ?annotation
        crm:P141_assigned ?entity ;
        dcterms:created ?date ;
        dcterms:creator ?author.
}
`

export const getFlatAnnotations = projectIri => `
PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
PREFIX dcterms: <http://purl.org/dc/terms/>
SELECT ?entity ?annotation ?date ?author ?notes ?concepts
FROM <http://data-iremus.huma-num.fr/graph/tonalities-contributions>
WHERE {
    {
        SELECT ?entity (MAX(?dates) AS ?date) (GROUP_CONCAT(?note; separator=", ") AS ?notes) (GROUP_CONCAT(?concept; separator=", ") AS ?concepts)
        WHERE {
            <${projectIri}> crm:P9_consists_of ?annotation.
            ?annotation
                crm:P177_assigned_property_of_type crm:P67_refers_to ;
                crm:P140_assigned_attribute_to ?note ;
                crm:P141_assigned ?entity ;
                dcterms:created ?dates.
        
            ?assignments crm:P140_assigned_attribute_to ?entity ;
                crm:P177_assigned_property_of_type crm:P2_has_type ;
                crm:P141_assigned ?concept.
        }
        GROUP BY ?entity
    }
    ?annotation
        crm:P141_assigned ?entity ;
        dcterms:created ?date ;
        dcterms:creator ?author.
}
`

export const getContributor = contributorIri => `
PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
PREFIX analysis: <http://modality-tonality.huma-num.fr/analysisOntology#>
SELECT ?contributor ?color ?emoji ?orcid ?name
FROM <http://data-iremus.huma-num.fr/graph/users>
WHERE {
    VALUES ?contributor { <${contributorIri}> }

    ?contributor crm:P1_is_identified_by ?unicode.
    ?unicode crm:P2_has_type <http://data-iremus.huma-num.fr/id/04242f64-fbb3-4b5b-bb2e-3ddd59eeea18>.
    ?unicode crm:P190_has_symbolic_content ?emoji.

    ?contributor crm:P1_is_identified_by ?hexcode.
    ?hexcode crm:P2_has_type <http://data-iremus.huma-num.fr/id/5f1bb74f-6ea0-4073-8b68-086f98454f1c>.
    ?hexcode crm:P190_has_symbolic_content ?color.

    ?contributor crm:P1_is_identified_by ?identifier.
    ?identifier crm:P2_has_type <http://data-iremus.huma-num.fr/id/d7ef2583-ff31-4913-9ed3-bc3a1c664b21>.
    ?identifier crm:P190_has_symbolic_content ?orcid.
    
    OPTIONAL {
        ?contributor crm:P1_is_identified_by ?surname.
        ?surname crm:P2_has_type <http://data-iremus.huma-num.fr/id/73ea8d74-3526-4f6a-8830-dd369795650d>.
        ?surname crm:P190_has_symbolic_content ?name.
    }
}`

export const getAnalyticalProject = analyticalProjectIri => `
PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
PREFIX sherlock: <http://data-iremus.huma-num.fr/ns/sherlock#>
SELECT * FROM <http://data-iremus.huma-num.fr/graph/tonalities-contributions>
WHERE {
    VALUES ?project { <${analyticalProjectIri}> }
    VALUES ?draft { <${DRAFT_PROJECT}> }
    ?project crm:P2_has_type <${ANALYTICAL_PROJECT}>.
    ?project crm:P1_is_identified_by ?label.
    ?project crm:P14_carried_out_by ?contributor.
    OPTIONAL { ?project crm:P3_has_note ?description }.
    OPTIONAL {
        ?project crm:P1_is_identified_by ?hexcode.
        ?hexcode crm:P2_has_type <http://data-iremus.huma-num.fr/id/5f1bb74f-6ea0-4073-8b68-086f98454f1c>.
        ?hexcode crm:P190_has_symbolic_content ?color.
    }
    OPTIONAL { ?project sherlock:has_privacy_type ?privacyType }.
    OPTIONAL { ?label crm:P190_has_symbolic_content ?content }.
}
LIMIT 1`

export const getScoreUrl = projectIri => `
PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
PREFIX sherlock: <http://data-iremus.huma-num.fr/ns/sherlock#>
SELECT ?url FROM <http://data-iremus.huma-num.fr/graph/tonalities-contributions>
WHERE {
    <${projectIri}> crm:P9_consists_of ?annotations.
    ?annotations sherlock:has_document_context ?url.
}
LIMIT 1`

export const getP140 = e13 => `
PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
SELECT * FROM <http://data-iremus.huma-num.fr/graph/tonalities-contributions>
WHERE { <${e13}> crm:P140_assigned_attribute_to ?p140 }
`

export const getAssignments = analyticalEntityIri => `
PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
PREFIX dcterms: <http://purl.org/dc/terms/>

SELECT * FROM <http://data-iremus.huma-num.fr/graph/tonalities-contributions>
WHERE {
    ?assignment crm:P140_assigned_attribute_to <${analyticalEntityIri}>.
    ?assignment crm:P141_assigned ?p141.
    ?assignment crm:P177_assigned_property_of_type ?type.
    ?assignment dcterms:created ?date.
    ?assignment dcterms:creator ?author.
    OPTIONAL {
        ?annotation crm:P141_assigned ?p141.
        ?annotation crm:P177_assigned_property_of_type crm:P67_refers_to.
    }
}
`
// TODO should be type = PUBLISHED_PROJECT
export const getProjects = scoreIri => `
PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
PREFIX sherlock: <http://data-iremus.huma-num.fr/ns/sherlock#>
SELECT ?project (COUNT(?annotation) AS ?annotations) (SAMPLE(?projectLabel) AS ?label) (SAMPLE(?projectContributor) AS ?contributor) (SAMPLE(?projectContent) AS ?content)
FROM <http://data-iremus.huma-num.fr/graph/tonalities-contributions>
WHERE { 
    ?annotation sherlock:has_document_context <${scoreIri}>.
    ?project crm:P9_consists_of ?annotation.
    ?project crm:P1_is_identified_by ?projectLabel.
    ?project crm:P14_carried_out_by ?projectContributor.
    ?project sherlock:has_privacy_type ?type.
    FILTER(?type = <${DRAFT_PROJECT}>).
    OPTIONAL { ?projectLabel crm:P190_has_symbolic_content ?projectContent }.
 }
 GROUP BY ?project
`

export const getPersonalProjects = userIri => `
PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
PREFIX sherlock: <http://data-iremus.huma-num.fr/ns/sherlock#>
SELECT ?project (COUNT(?annotation) AS ?annotations) (SAMPLE(?name) AS ?label) (SAMPLE(?score) AS ?scoreIri)
FROM <http://data-iremus.huma-num.fr/graph/tonalities-contributions>
WHERE { 
    ?project crm:P14_carried_out_by <${userIri}>.
    ?project crm:P1_is_identified_by ?name.
    ?project crm:P9_consists_of ?annotation.
    ?annotation sherlock:has_document_context ?score.
 }
 GROUP BY ?project
`

export const exportProject = ({ projectIri, scoreIri }) => `
PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
PREFIX sherlock: <http://data-iremus.huma-num.fr/ns/sherlock#>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX iremus: <http://data-iremus.huma-num.fr/id/>
PREFIX guillotel: <https://w3id.org/polifonia/ontology/modal-tonal/Cadences_FilaberGuillotelGurrieri_2023#>
PREFIX guillotel2023: <https://w3id.org/polifonia/ontology/modal-tonal/Cadences_FilaberGuillotelGurrieri_2023#>
PREFIX manganisabaino: <https://w3id.org/polifonia/ontology/modal-tonal/Mangani-Sabaino_TextMusic/>
PREFIX interpretation: <https://w3id.org/polifonia/ontology/music-analysis/interpretation/>
PREFIX oldFugue: <https://w3id.org/polifonia/ontology/modal-tonal/Fugue#>
PREFIX fugue: <https://w3id.org/polifonia/ontology/modal-tonal/Fugue/>
PREFIX zarlino: <https://w3id.org/polifonia/ontology/music-analysis/zarlino/>
PREFIX chordsCommonPractices: <https://w3id.org/polifonia/ontology/music-analysis/chordsCommonPractice/>
PREFIX corpus: <${scoreIri.substring(0, scoreIri.lastIndexOf('/'))}/>
PREFIX mei: <${scoreIri}#>
CONSTRUCT {
    ?s ?p ?o.
    ?score a crm:E1_CRM_Entity.
}
FROM <http://data-iremus.huma-num.fr/graph/tonalities-contributions>
FROM <http://data-iremus.huma-num.fr/graph/users>
WHERE
{ 
    {
        <${projectIri}> ?t ?s.
        ?s ?p ?o.
    }
    UNION
    {
        VALUES ?s { <${projectIri}> }
        ?s ?p ?o.
    }
    UNION
    {
        <${projectIri}> crm:P14_carried_out_by ?user.
        ?user crm:P1_is_identified_by ?s.
        ?s crm:P2_has_type iremus:73ea8d74-3526-4f6a-8830-dd369795650d.
        ?s ?p ?o.
    }
    UNION
    {
        <${projectIri}> crm:P14_carried_out_by ?user.
        ?user crm:P1_is_identified_by ?s.
        ?s crm:P2_has_type iremus:d7ef2583-ff31-4913-9ed3-bc3a1c664b21.
        ?s ?p ?o.
    }
    UNION
    {
        <${projectIri}> crm:P9_consists_of ?observation.
        ?observation crm:P177_assigned_property_of_type crm:P2_has_type.
        ?observation sherlock:has_document_context ?score.
    }
 }
`

export const exportProjectToMeta = projectIri => `
PREFIX iremus: <http://data-iremus.huma-num.fr/id/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX core: <https://w3id.org/polifonia/ontology/core/>
PREFIX mm: <https://w3id.org/polifonia/ontology/music-meta/>
PREFIX mr: <https://w3id.org/polifonia/ontology/music-representation/>
PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
PREFIX sherlock: <http://data-iremus.huma-num.fr/ns/sherlock#>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX guillotel2022: <http://modality-tonality.huma-num.fr/Guillotel_2022#>
PREFIX zarlino1558: <https://w3id.org/polifonia/ontology/modal-tonal#>
PREFIX praetorius1619: <http://modality-tonality.huma-num.fr/static/ontologies/modalityTonality_Praetorius#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
CONSTRUCT {
    ?project a mr:Analysis.
    ?project mr:involvesAnalyst ?analyst.
    ?project core:title ?label.
    ?project mr:hasAnnotation ?annotation.

    ?analyst a core:Person.
    ?analyst owl:sameAs ?orcid.

    ?score a mr:MusicContent.
    ?score a mm:DigitalScore.
    ?score mr:hasAnnotation ?annotation.
    ?score mr:hasFragment ?notes.

    ?annotation a mr:Annotation.
    ?annotation mr:describesFragment ?notes.
    ?annotation mr:hasAnnotator ?annotator.
    ?annotation dcterms:created ?annotationDate.

    ?observation a mr:Observation.
    ?annotation mr:hasObservation ?observation.
    ?observation mr:hasSubject ?concept.
    ?observation dcterms:created ?observationDate.

    ?subAnnotation core:isDerivedFrom ?supAnnotation
}
FROM <http://data-iremus.huma-num.fr/graph/tonalities-contributions>
FROM <http://data-iremus.huma-num.fr/graph/users>
WHERE {
    VALUES ?project { <${projectIri}> }

    ?project dcterms:creator ?analyst.
    ?project crm:P1_is_identified_by ?label.
    ?project crm:P9_consists_of ?annotation.
    ?project crm:P9_consists_of ?observation.
    ?project crm:P9_consists_of ?linking.

    ?analyst crm:P1_is_identified_by ?analystId.
    ?analystId crm:P2_has_type iremus:d7ef2583-ff31-4913-9ed3-bc3a1c664b21.
    ?analystId crm:P190_has_symbolic_content ?orcidId.
    BIND(IRI(CONCAT("http://orcid.org/", ?orcidId)) AS ?orcid)

    ?annotation crm:P177_assigned_property_of_type crm:P67_refers_to.
    ?annotation crm:P140_assigned_attribute_to ?notes.
    ?annotation dcterms:creator ?annotator.
    ?annotation dcterms:created ?annotationDate.
    ?annotation crm:P141_assigned ?entity.
    
    ?observation crm:P140_assigned_attribute_to ?entity.
    ?observation crm:P177_assigned_property_of_type crm:P2_has_type.
    ?observation dcterms:created ?observationDate.
    ?observation crm:P141_assigned ?concept.
    ?observation sherlock:has_document_context ?score.

    OPTIONAL {
        ?linking crm:P177_assigned_property_of_type <crm:P106_is_composed_of>.
        ?linking crm:P141_assigned ?sub.
        ?linking crm:P140_assigned_attribute_to ?sup.
        ?subAnnotation crm:P141_assigned ?sub.
        ?subAnnotation crm:P177_assigned_property_of_type crm:P67_refers_to.
        ?supAnnotation crm:P141_assigned ?sup.
        ?supAnnotation crm:P177_assigned_property_of_type crm:P67_refers_to.
    }
}
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
