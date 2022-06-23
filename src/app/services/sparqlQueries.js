import { SELECTION } from '../../features/score/constants'

export const getNotesOnFirstBeat = noteIri => `
    PREFIX sherlockmei: <http://data-iremus.huma-num.fr/ns/sherlockmei#>
    SELECT ?notes ?beat ?selectedNote
    WHERE {
        GRAPH <http://data-iremus.huma-num.fr/graph/modality-tonality> {
            ?notes sherlockmei:contains_beat ?beat
            {
                SELECT ?beat ?selectedNote
                WHERE {
                    BIND (<${noteIri}> AS ?selectedNote)
                    ?selectedNote sherlockmei:contains_beat ?beat
                }
                ORDER BY ASC(?beat)
                LIMIT 1
            }
        }
    }
`

export const getNoteInfo = noteIri => `
    PREFIX sherlockmei: <http://data-iremus.huma-num.fr/ns/sherlockmei#>
    SELECT *
    WHERE {
        GRAPH <http://data-iremus.huma-num.fr/graph/modality-tonality> {
            VALUES ?note {<${noteIri}>}
            ?note sherlockmei:pname ?pname.
            ?note sherlockmei:oct ?oct.
            OPTIONAL {?note sherlockmei:accid ?accid}
        }
    }
`

export const getAnnotationInfo = annotationIri => `
    PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    SELECT ?concept
    WHERE {
        GRAPH <http://data-iremus.huma-num.fr/graph/modality-tonality> {
            <${annotationIri}> crm:P141_assigned ?group .
            ?assignment crm:P140_assigned_attribute_to ?group .
            ?assignment crm:P177_assigned_property_of_type rdf:type .
            ?assignment crm:P141_assigned ?concept
        }
    }
`

export const getSubAnnotations = annotationIri => `
    PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

    SELECT ?selection ?type
    WHERE {
        GRAPH <http://data-iremus.huma-num.fr/graph/modality-tonality> {
            <${annotationIri}> crm:P141_assigned ?group .
            ?assignment crm:P140_assigned_attribute_to ?group .
            FILTER NOT EXISTS {?assignment crm:P177_assigned_property_of_type rdf:type }
            ?assignment crm:P141_assigned ?selection .
            ?assignment crm:P177_assigned_property_of_type ?type
        }
    }
`

export const getConceptAnnotations = conceptIri => `
    PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
    SELECT ?entity ?programName
    WHERE {
        GRAPH <http://data-iremus.huma-num.fr/graph/modality-tonality> {
            ?annotation crm:P141_assigned <${conceptIri}>.
            ?annotation crm:P140_assigned_attribute_to ?conceptualEntity.
            ?entity crm:P141_assigned ?conceptualEntity.
            ?entity crm:P14_carried_out_by ?infos.
            ?infos <http://modality-tonality.huma-num.fr/analysisOntology#hasPythonClassName> ?programName.
        }
    }
`

export const getNoteSelections = noteIri => `
    PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
    SELECT ?selection
    FROM <http://data-iremus.huma-num.fr/graph/modality-tonality>
    FROM <http://data-iremus.huma-num.fr/graph/sherlock>
    WHERE {
        ?selection crm:P106_is_composed_of <${noteIri}>.
        ?selection crm:P2_has_type <${SELECTION}>.
    }
`

export const getScoreSelections = scoreIri => `
    PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
    PREFIX dcterm: <http://purl.org/dc/terms/>
    PREFIX sherlockmei: <http://data-iremus.huma-num.fr/ns/sherlockmei#>
    SELECT ?selection ?entities ?contributor
    FROM <http://data-iremus.huma-num.fr/graph/modality-tonality>
    FROM <http://data-iremus.huma-num.fr/graph/sherlock>
    WHERE {
        ?selection dcterm:creator ?contributor
        {
            SELECT ?selection ((COUNT(?entity)) AS ?entities)
            WHERE {
                ?entity sherlockmei:in_score <${scoreIri}>.
                ?selection crm:P106_is_composed_of ?entity.
                ?selection crm:P2_has_type <${SELECTION}>.
            }
            GROUP BY ?selection
        }
    }
`

export const getChildSelections = selectionIri => `
    PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
    SELECT ?child ?type
    FROM <http://data-iremus.huma-num.fr/graph/modality-tonality>
    FROM <http://data-iremus.huma-num.fr/graph/sherlock>
    WHERE {
        <${selectionIri}> crm:P106_is_composed_of ?child.
        ?child crm:P2_has_type ?type
    }
`

export const getParentSelections = selectionIri => `
    PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
    SELECT ?parent ?type
    FROM <http://data-iremus.huma-num.fr/graph/modality-tonality>
    FROM <http://data-iremus.huma-num.fr/graph/sherlock>
    WHERE {
        ?parent crm:P106_is_composed_of <${selectionIri}>.
        OPTIONAL {?parent crm:P2_has_type ?type}
    }
`

export const getNoteAnnalyticalEntities = noteIri => `
    PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
    SELECT ?annotation ?concept
    FROM <http://data-iremus.huma-num.fr/graph/modality-tonality>
    FROM <http://data-iremus.huma-num.fr/graph/sherlock>
    WHERE {
        ?e13 crm:P141_assigned <${noteIri}>.
        ?e13 crm:P177_assigned_property_of_type ?concept.
        ?e13 crm:P140_assigned_attribute_to ?entity.
        ?annotation crm:P141_assigned ?entity 
    }
`

export const getAnnotationSelection = annotationIri => `
    PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
    SELECT ?selection
    FROM <http://data-iremus.huma-num.fr/graph/modality-tonality>
    FROM <http://data-iremus.huma-num.fr/graph/sherlock>
    WHERE {
        <${annotationIri}> crm:P140_assigned_attribute_to ?selection
    }
    LIMIT 1
`

export const getNoteVerticality = noteIri => `
    PREFIX sherlockmei: <http://data-iremus.huma-num.fr/ns/sherlockmei#>
    SELECT ?verticality ?selectedNote
    FROM <http://data-iremus.huma-num.fr/graph/modality-tonality>
    FROM <http://data-iremus.huma-num.fr/graph/sherlock>
    WHERE {
        <${noteIri}> sherlockmei:contains_beat ?verticality
    }
    ORDER BY ASC(?verticality)
    LIMIT 1
`

export const getVerticalityPositionnedNotes = verticalityIri => `
PREFIX sherlockmei: <http://data-iremus.huma-num.fr/ns/sherlockmei#>
SELECT ?positionned_note ?note
FROM <http://data-iremus.huma-num.fr/graph/modality-tonality>
FROM <http://data-iremus.huma-num.fr/graph/sherlock>
WHERE {
    ?note sherlockmei:contains_beat <${verticalityIri}>.
    ?note sherlockmei:has_beat_anchor ?positionned_note.
    FILTER regex(str(?positionned_note), "${verticalityIri.slice(-6)}")
}
`

export const getSelectionAnalyticalEntities = selectionIri => `
    PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
    SELECT ?annotation
    FROM <http://data-iremus.huma-num.fr/graph/modality-tonality>
    FROM <http://data-iremus.huma-num.fr/graph/sherlock>
    WHERE {
        ?annotation crm:P140_assigned_attribute_to <${selectionIri}>.
    }
`

export const getOutgoingAnnotations = entityIri => `
    PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
    PREFIX dcterms: <http://purl.org/dc/terms/>
    SELECT ?annotation ?date ?contributor ?object ?predicat
    FROM <http://data-iremus.huma-num.fr/graph/sherlock>
    FROM <http://data-iremus.huma-num.fr/graph/modality-tonality>
    WHERE {
            ?annotation crm:P140_assigned_attribute_to <${entityIri}>.
            ?annotation a crm:E13_Attribute_Assignment.
            ?annotation dcterms:created ?date.
            ?annotation crm:P141_assigned ?object.
            ?annotation crm:P177_assigned_property_of_type ?predicat.
            ?annotation crm:P14_carried_out_by ?contributor.
    }
`

export const getIncommingAnnotations = entityIri => `
    PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
    PREFIX dcterms: <http://purl.org/dc/terms/>
    
    SELECT ?annotation ?date ?contributor ?subject ?predicat
    
    FROM <http://data-iremus.huma-num.fr/graph/sherlock>
    FROM <http://data-iremus.huma-num.fr/graph/modality-tonality>
    
    WHERE {
        ?annotation crm:P141_assigned <${entityIri}>.
        ?annotation a crm:E13_Attribute_Assignment.
        ?annotation dcterms:created ?date.
        ?annotation crm:P140_assigned_attribute_to ?subject.
        ?annotation crm:P177_assigned_property_of_type ?predicat.
        ?annotation crm:P14_carried_out_by ?contributor.
    }
`

export const getAnnotation = annotationIri => `
    PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
    PREFIX dcterms: <http://purl.org/dc/terms/>

    SELECT ?subject ?predicat ?object ?date ?contributor
    
    FROM <http://data-iremus.huma-num.fr/graph/modality-tonality>
    FROM <http://data-iremus.huma-num.fr/graph/sherlock>
    
    WHERE {
        VALUES ?annotation {<${annotationIri}>}
        ?annotation a crm:E13_Attribute_Assignment.
        
        ?annotation crm:P140_assigned_attribute_to ?subject.
        ?subject crm:P2_has_type ?subjectType.

        ?annotation crm:P141_assigned ?object.
        OPTIONAL { ?object crm:P2_has_type ?objectType }

        ?annotation crm:P177_assigned_property_of_type ?predicat.
        ?annotation dcterms:created ?date.
        ?annotation crm:P14_carried_out_by ?contributor.
    }
`
