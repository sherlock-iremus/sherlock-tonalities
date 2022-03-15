export const getNotesOnFirstBeat = noteId => `
    PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
    PREFIX sherlock: <http://data-iremus.huma-num.fr/ns/sherlockmei#>

    SELECT ?notesInBeat ?firstBeat
    WHERE {
        ?notesInBeat sherlock:contains_beats ?firstBeat.
        {
        SELECT ?firstBeat
        WHERE {
            ?selectedNote crm:P1_is_identified_by ?selectedNoteId.
            FILTER(regex(STR(?selectedNote), "${noteId}$")).
            ?selectedNote sherlock:contains_beats ?firstBeat
        }
        LIMIT 1
        }
    }
`