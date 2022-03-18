export const getNotesOnFirstBeat = noteIri => `
    PREFIX sherlock: <http://data-iremus.huma-num.fr/ns/sherlockmei#>
    SELECT ?notes ?beat ?selectedNote
    WHERE {
    ?notes sherlock:contains_beats ?beat
    {
        SELECT ?beat ?selectedNote
        WHERE {
            BIND (<${noteIri}> AS ?selectedNote)
            ?selectedNote sherlock:contains_beats ?beat
        }
        ORDER BY ASC(?beat)
        LIMIT 1
    }
    }
`

export const getNoteInfo = noteIri => `
    PREFIX sherlock: <http://data-iremus.huma-num.fr/ns/sherlockmei#>
    SELECT *
    WHERE {
    VALUES ?note {<${noteIri}>}
    ?note sherlock:pname ?pname.
    ?note sherlock:oct ?oct.
    OPTIONAL {?note sherlock:accid ?accid}
    }
`