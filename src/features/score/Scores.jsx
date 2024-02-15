import { AudioFile, ChevronRight } from '@mui/icons-material'
import { IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { FixedSizeList as List } from 'react-window'

export const VirtualizedList = ({ scores, selectedComposers, filter, selectedScoreId, setSelectedScoreId }) => {
  const filteredScores = scores
    .filter(e => (selectedComposers.length ? selectedComposers.some(c => e.scoreComposer.includes(c)) : true))
    .filter(e => (filter ? e.scoreTitle.toLowerCase().includes(filter.toLowerCase()) : true))

  const Row = ({ index }) => {
    const { meiUrl, scoreTitle, scoreComposer } = filteredScores[index]
    return (
      <ListItem
        key={meiUrl}
        dense
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
    <List height={400} itemCount={filteredScores.length} itemSize={60} width="100%">
      {Row}
    </List>
  )
}
