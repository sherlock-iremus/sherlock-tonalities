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

export const getScoreAnnotations = scoreIri => `
    PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
    SELECT ?root
    WHERE {
        GRAPH <http://data-iremus.huma-num.fr/graph/modality-tonality> {
            ?analysis crm:P16_used_specific_object <${scoreIri}> .
            ?analysis crm:P9_consists_of ?annotation .
            ?annotation crm:P140_assigned_attribute_to ?group .
            ?root crm:P141_assigned ?group .
        }
    }
    GROUP BY ?root
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
    PREFIX dcterm: <http://purl.org/dc/terms/>
    SELECT ?selection
    WHERE {
        GRAPH <http://data-iremus.huma-num.fr/graph/modality-tonality> {
            ?selection crm:P106_is_composed_of <${noteIri}>.
            ?selection crm:P2_has_type <http://data-iremus.huma-num.fr/id/9d0388cb-a178-46b2-b047-b5a98f7bdf0b>.
        }
    }
`

export const getScoreSelections = scoreIri => `
    PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
    PREFIX sherlockmei: <http://data-iremus.huma-num.fr/ns/sherlockmei#>
    SELECT ?selection ((COUNT(?entity)) AS ?entities)
    WHERE {
        GRAPH <http://data-iremus.huma-num.fr/graph/modality-tonality> {
            ?entity sherlockmei:in_score <${scoreIri}>.
            ?selection crm:P106_is_composed_of ?entity.
            ?selection crm:P2_has_type <http://data-iremus.huma-num.fr/id/9d0388cb-a178-46b2-b047-b5a98f7bdf0b>.
        }
    }
    GROUP BY ?selection
`

export const getChildSelections = selectionIri => `
    PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
    PREFIX sherlockmei: <http://data-iremus.huma-num.fr/ns/sherlockmei#>
    SELECT ?child ?type
    WHERE {
        GRAPH <http://data-iremus.huma-num.fr/graph/modality-tonality> {
            <${selectionIri}> crm:P106_is_composed_of ?child.
            OPTIONAL {?child crm:P2_has_type ?type}
            OPTIONAL {?child sherlockmei:element ?type}
        }
    }
`

export const getParentSelections = selectionIri => `
    PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
    SELECT ?parent ?type
    WHERE {
        GRAPH <http://data-iremus.huma-num.fr/graph/modality-tonality> {
            ?parent crm:P106_is_composed_of <${selectionIri}>.
            OPTIONAL {?parent crm:P2_has_type ?type}
        }
    }
`

export const getNoteAnnalyticalEntities = noteIri => `
    PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
    SELECT ?annotation ?concept
    WHERE {
        GRAPH <http://data-iremus.huma-num.fr/graph/modality-tonality> {
            ?e13 crm:P141_assigned <${noteIri}>.
            ?e13 crm:P177_assigned_property_of_type ?concept.
            ?e13 crm:P140_assigned_attribute_to ?entity.
            ?annotation crm:P141_assigned ?entity 
        }
    }
`

export const getAnnotationSelection = annotationIri => `
    PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
    SELECT ?selection
    WHERE {
        GRAPH <http://data-iremus.huma-num.fr/graph/modality-tonality> {
            <${annotationIri}> crm:P140_assigned_attribute_to ?selection
        }
    }
    LIMIT 1
`

export const getNoteVerticality = noteIri => `
    PREFIX sherlockmei: <http://data-iremus.huma-num.fr/ns/sherlockmei#>
    SELECT ?verticality ?selectedNote
    WHERE {
        GRAPH <http://data-iremus.huma-num.fr/graph/modality-tonality> {
            <${noteIri}> sherlockmei:contains_beat ?verticality
        }
    }
    ORDER BY ASC(?verticality)
    LIMIT 1
`

export const getVerticalityPositionnedNotes = verticalityIri => `
PREFIX sherlockmei: <http://data-iremus.huma-num.fr/ns/sherlockmei#>
SELECT ?positionned_note ?note
WHERE {
    GRAPH <http://data-iremus.huma-num.fr/graph/modality-tonality> {
        ?note sherlockmei:contains_beat <${verticalityIri}>.
        ?note sherlockmei:has_beat_anchor ?positionned_note.
        FILTER regex(str(?positionned_note), "${verticalityIri.slice(-6)}")
    }
}
`
