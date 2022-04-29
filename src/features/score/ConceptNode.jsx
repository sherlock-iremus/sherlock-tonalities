import { HistoryEdu } from "@mui/icons-material"
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import { LoadingNode } from "./LoadingNode"

export const ConceptNode = props => {
  // SPARQL query get annotations

  return props.concept ? (
        <ListItem disablePadding>
          <ListItemButton sx={{ cursor: 'default' }}>
            <ListItemIcon>
              <HistoryEdu />
            </ListItemIcon>
            <ListItemText primary={props.concept} />
          </ListItemButton>
        </ListItem>
  ) : <LoadingNode />
}
