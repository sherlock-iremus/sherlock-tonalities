import { AudioFile, ChevronRight } from '@mui/icons-material'
import {
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Typography,
} from '@mui/material'
import { FixedSizeList as List } from 'react-window'

export const VirtualizedList = ({ scores, selectedComposers, filter, selectedScoreId, setSelectedScoreId }) => {
  const filteredScores = scores
    .filter(e => (selectedComposers.length ? selectedComposers.some(c => e.scoreComposer.includes(c)) : true))
    .filter(e => (filter ? e.scoreTitle.toLowerCase().includes(filter.toLowerCase()) : true))

  const Row = ({ index, style }) => {
    const { meiUrl, scoreTitle, scoreComposer } = filteredScores[index]
    return (
      <ListItem
        key={meiUrl}
        dense
        style={style}
        disablePadding
        secondaryAction={
          <IconButton edge="end" disableRipple>
            <ChevronRight />
          </IconButton>
        }
      >
        <ListItemButton
          selected={selectedScoreId === meiUrl}
          onClick={() => setSelectedScoreId(selectedScoreId === meiUrl ? '' : meiUrl)}
        >
          <ListItemIcon>
            <AudioFile />
          </ListItemIcon>
          <ListItemText primary={scoreTitle} secondary={scoreComposer} />
        </ListItemButton>
      </ListItem>
    )
  }

  return (
    <>
      <Typography variant="caption" textAlign="end" px={1} color="text.secondary">
        {filteredScores.length} results
      </Typography>
      <List height={400} itemCount={filteredScores.length} itemSize={60} width="100%">
        {Row}
      </List>
    </>
  )
}
