import { ANALYTICAL_ENTITY, SELECTION } from '../../features/score/constants'

export const getNoteInfo = noteIri => `
    PREFIX sherlockmei: <http://data-iremus.huma-num.fr/ns/sherlockmei#>
    
    SELECT *

    FROM <http://data-iremus.huma-num.fr/graph/modality-tonality>
    FROM <http://data-iremus.huma-num.fr/graph/sherlock>

    WHERE {
        VALUES ?note {<${noteIri}>}
        ?note sherlockmei:pname ?pname.
        ?note sherlockmei:oct ?oct.
        OPTIONAL {?note sherlockmei:accid ?accid}
    }
    LIMIT 1
`

export const getAnalyticalEntity = analyticalEntityIri => `
    PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX dcterm: <http://purl.org/dc/terms/>

    SELECT ?selection ?contributor ?date
    
    FROM <http://data-iremus.huma-num.fr/graph/modality-tonality>
    FROM <http://data-iremus.huma-num.fr/graph/sherlock>

    WHERE {
        ?annotation crm:P141_assigned <${analyticalEntityIri}>.
        ?annotation crm:P140_assigned_attribute_to ?selection.
        ?annotation crm:P14_carried_out_by ?contributor.
        ?annotation dcterm:created ?date.
    }
    LIMIT 1
`

export const getEntityGlobalAnnotations = analyticalEntityIri => `
    PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

    SELECT ?annotation ?object
    
    FROM <http://data-iremus.huma-num.fr/graph/modality-tonality>
    FROM <http://data-iremus.huma-num.fr/graph/sherlock>
    
    WHERE {
        ?annotation crm:P140_assigned_attribute_to <${analyticalEntityIri}>.
        ?annotation crm:P177_assigned_property_of_type rdf:type.
        ?annotation crm:P141_assigned ?object.   
    }
`

export const getEntitySpecificAnnotations = analyticalEntityIri => `
    PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

    SELECT ?annotation ?predicat ?object

    FROM <http://data-iremus.huma-num.fr/graph/modality-tonality>
    FROM <http://data-iremus.huma-num.fr/graph/sherlock>

    WHERE {
        ?annotation crm:P140_assigned_attribute_to <${analyticalEntityIri}>.
        FILTER NOT EXISTS {?annotation crm:P177_assigned_property_of_type rdf:type }
        ?annotation crm:P177_assigned_property_of_type ?predicat.
        ?annotation crm:P141_assigned ?object.
    }
`

export const getAnalyticalEntities = entityIri => `
    PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
    PREFIX dcterm: <http://purl.org/dc/terms/>

    SELECT ?entity ?contributor ?predicat ?date ?assignments

    FROM <http://data-iremus.huma-num.fr/graph/modality-tonality>
    FROM <http://data-iremus.huma-num.fr/graph/sherlock>
    
    WHERE {
        ?annotation crm:P141_assigned <${entityIri}>.
        ?annotation crm:P140_assigned_attribute_to ?entity.
        ?annotation crm:P177_assigned_property_of_type ?predicat.
        ?annotation crm:P14_carried_out_by ?contributor.
        ?annotation dcterm:created ?date.
        {
           SELECT ?entity ((COUNT(?assignment)) AS ?assignments)
           WHERE {
               ?annotation crm:P141_assigned <${entityIri}>.
               ?annotation crm:P140_assigned_attribute_to ?entity.
               ?entity crm:P2_has_type <${ANALYTICAL_ENTITY}>.
               ?assignment crm:P140_assigned_attribute_to ?entity
           }
           GROUP BY ?entity
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
    PREFIX sherlock: <http://data-iremus.huma-num.fr/ns/sherlock#>
    
    SELECT ?selection ?contributor ?date ?entities
    
    FROM <http://data-iremus.huma-num.fr/graph/modality-tonality>
    FROM <http://data-iremus.huma-num.fr/graph/sherlock>
    
    WHERE {
        ?selection dcterm:creator ?contributor.
        ?selection dcterm:created ?date.
        {
            SELECT ?selection ((COUNT(?entity)) AS ?entities)
            WHERE {
                ?selection sherlock:has_document_context <${scoreIri}>.
                ?selection crm:P2_has_type <${SELECTION}>.
                ?selection crm:P106_is_composed_of ?entity.
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

export const getVerticalityCoordinates = verticalityIri => `
    PREFIX sherlockmei: <http://data-iremus.huma-num.fr/ns/sherlockmei#>
    
    SELECT ?note ?note
    
    FROM <http://data-iremus.huma-num.fr/graph/modality-tonality>
    
    WHERE {
        ?note sherlockmei:contains_beat <${verticalityIri}>.
    }
    LIMIT 1
`

export const getSelectionAnalyticalEntities = selectionIri => `
    PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
    PREFIX dcterm: <http://purl.org/dc/terms/>

    SELECT ?entity ?contributor ?predicat ?date ?assignments

    FROM <http://data-iremus.huma-num.fr/graph/modality-tonality>
    FROM <http://data-iremus.huma-num.fr/graph/sherlock>

    WHERE {
        ?annotation crm:P140_assigned_attribute_to <${selectionIri}>.
        ?annotation crm:P141_assigned ?entity.
        ?annotation crm:P177_assigned_property_of_type ?predicat.
        ?annotation crm:P14_carried_out_by ?contributor.
        ?annotation dcterm:created ?date.
        {
            SELECT ?entity ((COUNT(?assignment)) AS ?assignments)
            WHERE {
                ?annotation crm:P140_assigned_attribute_to <${selectionIri}>.
                ?annotation crm:P141_assigned ?entity.
                ?entity crm:P2_has_type <${ANALYTICAL_ENTITY}>.
                ?assignment crm:P140_assigned_attribute_to ?entity
            }
            GROUP BY ?entity
        } 
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

export const getContributor = contributorIri => `
    PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
    PREFIX analysis: <http://modality-tonality.huma-num.fr/analysisOntology#>

    SELECT ?contributor ?color ?emoji ?program

    FROM <http://data-iremus.huma-num.fr/graph/users>
    FROM <http://data-iremus.huma-num.fr/graph/modality-tonality>

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
`

export const getPositionnedNoteInfo = positionnedNoteIri => `
    PREFIX sherlockmei: <http://data-iremus.huma-num.fr/ns/sherlockmei#>
   
    SELECT ?attachedNote ?clickedNote ?verticality
    
    FROM <http://data-iremus.huma-num.fr/graph/modality-tonality>
    
    WHERE {
        ?attachedNote sherlockmei:has_beat_anchor <${positionnedNoteIri}>.
        ?attachedNote sherlockmei:contains_beat ?verticality.
        FILTER regex(str(?verticality), "${positionnedNoteIri.slice(-6)}")
        ?clickedNote sherlockmei:contains_beat ?verticality.
    }
    LIMIT 1
`

export const getEntityType = entityIri => `
    PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>

    SELECT ?type ?iri ?label

    FROM <http://data-iremus.huma-num.fr/graph/modality-tonality>
    FROM <http://data-iremus.huma-num.fr/graph/sherlock>

    WHERE {
        VALUES ?iri {<${entityIri}>}.
        OPTIONAL {<${entityIri}> crm:P2_has_type ?type}
        OPTIONAL {<${entityIri}> crm:P1_is_identified_by ?label}
        # FILTER (lang(?label) = "en" )
    }
`
