import { Chip, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material"
import { useGetAnnotationInfoQuery, useGetSubAnnotationsQuery } from "../../../app/services/sparql"
import { LoadingEntity } from "./LoadingEntity"
import { NoteEntity } from "./NoteEntity"

export const AnnotationEntity = props => {
    const { data: concepts } = useGetAnnotationInfoQuery(props.annotationIri)
    const { data: subAnnotations } = useGetSubAnnotationsQuery(props.annotationIri)

    return concepts && subAnnotations ? (
        <>
            <ListItem disablePadding>
                <ListItemButton>
                    <ListItemText
                        primary={concepts.map(concept => (
                            <Chip
                                key={concept}
                                label={concept.slice(props.treatiseIri.length)}
                                sx={{ m: 0.3 }}
                            />
                        ))}
                        secondary={props.annotationIri.slice(props.baseUrl.length)}
                    />
                </ListItemButton>
            </ListItem>
            <List sx={{ pl: 2 }} dense disablePadding subheader={<ListSubheader>Associated selection</ListSubheader>}>
                {subAnnotations.map(subAnnotation =>
                    <NoteEntity
                        disablePadding
                        key={subAnnotation.entity}
                        noteIri={subAnnotation.entity}
                        scoreIri={props.scoreIri}
                        baseUrl={props.baseUrl}
                        secondaryAction={<Chip label={subAnnotation.concept.slice(props.treatiseIri.length)} />}
                    />
                )}
            </List>
        </>
    ) : <LoadingEntity />
}
