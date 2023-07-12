import {
  Avatar,
  CircularProgress,
  Collapse,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
} from '@mui/material'
import { useDeleteAnnotationMutation } from '../../services/service'
import { getModel, getUuid, removeBaseIri } from '../../utils'
import { ContributorItem } from './ContributorItem'
import { Comment, Delete } from '@mui/icons-material'
import { useState } from 'react'

export const Assignment = ({ assignment, concept, comment, refetch, date, author }) => {
  const [deleteAnnotation, { isLoading }] = useDeleteAnnotationMutation()
  const [isHovered, setIsHovered] = useState(false)

  const removeAssignment = async () => {
    try {
      await deleteAnnotation(getUuid(assignment)).unwrap()
      refetch()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <ul style={{ margin: 0, padding: 0 }}>
      <Stack
        key={concept || comment}
        flex={1}
        borderRadius={3}
        bgcolor="secondary.main"
        boxShadow={1}
        overflow="hidden"
        margin={1}
      >
        <ListItem
          disablePadding
          sx={{ '& .MuiListItemSecondaryAction-root': { top: 30 } }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          secondaryAction={
            <Collapse in={isHovered} timeout="auto" unmountOnExit>
              <Stack direction="row" alignItems="center">
                <ContributorItem contributorIri={author} />
                <Tooltip title="Delete assignment">
                  <IconButton onClick={removeAssignment} size="small">
                    {isLoading ? <CircularProgress /> : <Delete />}
                  </IconButton>
                </Tooltip>
              </Stack>
            </Collapse>
          }
        >
          <ListItemButton dense>
            <ListItemIcon>
              {concept ? (
                <Tooltip title={getModel(concept) + ' music model'}>
                  <Avatar sx={{ height: 32, width: 32 }}>{getModel(concept)[0].toUpperCase()}</Avatar>
                </Tooltip>
              ) : (
                <Avatar sx={{ height: 32, width: 32 }}>
                  <Comment fontSize="8" />
                </Avatar>
              )}
            </ListItemIcon>
            <ListItemText
              primary={comment ? comment[0].toUpperCase() + comment : removeBaseIri(concept)}
              secondary={new Date(date).toLocaleDateString('en-GB')}
            ></ListItemText>
          </ListItemButton>
        </ListItem>
      </Stack>
    </ul>
  )
}
