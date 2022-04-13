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

export const getAnnotations = ([scoreIri, treatiseIri]) => `
    PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
    PREFIX sherlock: <http://data-iremus.huma-num.fr/ns/sherlockmei#>
    SELECT ?annotation ?concept
    WHERE {
        GRAPH <http://data-iremus.huma-num.fr/graph/modality-tonality> {
            ?analysis crm:P16_used_specific_object <${scoreIri}> .
            ?analysis crm:P9_consists_of ?annotation .
            ?annotation crm:P141_assigned ?concept .
            FILTER (regex(str(?concept),"${treatiseIri}")) .
        }
    }
`