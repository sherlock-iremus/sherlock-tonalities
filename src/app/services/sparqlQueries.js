export const getNotesOnFirstBeat = noteIri => `
    PREFIX sherlock: <http://data-iremus.huma-num.fr/ns/sherlockmei#>
    SELECT ?notes ?beat ?selectedNote
    WHERE {
        GRAPH <http://data-iremus.huma-num.fr/graph/modality-tonality> {
            ?notes sherlock:contains_beat ?beat
            {
                SELECT ?beat ?selectedNote
                WHERE {
                    BIND (<${noteIri}> AS ?selectedNote)
                    ?selectedNote sherlock:contains_beat ?beat
                }
                ORDER BY ASC(?beat)
                LIMIT 1
            }
        }
    }
`

export const getNoteInfo = noteIri => `
    PREFIX sherlock: <http://data-iremus.huma-num.fr/ns/sherlockmei#>
    SELECT *
    WHERE {
        GRAPH <http://data-iremus.huma-num.fr/graph/modality-tonality> {
            VALUES ?note {<${noteIri}>}
            ?note sherlock:pname ?pname.
            ?note sherlock:oct ?oct.
            OPTIONAL {?note sherlock:accid ?accid}
        }
    }
`

export const getAnnotations = scoreIri => `
    PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
    PREFIX sherlock: <http://data-iremus.huma-num.fr/ns/sherlockmei#>
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
    PREFIX sherlock: <http://data-iremus.huma-num.fr/ns/sherlockmei#>
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
    PREFIX sherlock: <http://data-iremus.huma-num.fr/ns/sherlockmei#>
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