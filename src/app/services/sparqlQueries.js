export const getNotesOnFirstBeat = noteIri => `
    PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
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