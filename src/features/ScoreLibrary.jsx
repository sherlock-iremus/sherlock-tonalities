import { AudioFile } from '@mui/icons-material'
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Typography,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { setScore } from '../app/services/scoreSlice'
import scores from '../app/scores.json'
import cover from '../images/bg-score.jpg'
import { Navigate } from 'react-router-dom'
import { useState } from 'react'

export const ScoreLibrary = () => {
  const dispatch = useDispatch()
  const { scoreIri } = useSelector(state => state.score)
  const [selectedScore, setSelectedScore] = useState({ scoreIri })
  const baseUrlLength = useSelector(state => state.score.baseUrl.length)
  return (
    <Card sx={{ maxWidth: 600 }}>
      <CardMedia component="img" height="140" image={cover} alt="score" />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Pilot <i>Tonalities</i>
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'justify' }}>
          Tonalities is developing tools for the modal-tonal identification, exploration and classification of
          monophonic and polyphonic notated music from the Renaissance to the 20th century.
          <br />
          The pilot has a broader societal and pedagogical dimension: it does not only impact research on the theory and
          evolution of the musical language but is also relevant for the understanding of music collections by students,
          performers, and informed music lovers.
          <br />
          The recording industry is a potential target for the classification of works and the constitution of
          playlists.
        </Typography>
      </CardContent>
      <List subheader={<ListSubheader>Available scores</ListSubheader>} dense disablePadding>
        {scores.map(score => (
          <ListItem key={score.scoreIri} disablePadding>
            <ListItemButton
              onClick={() => setSelectedScore(score.scoreIri === selectedScore.scoreIri ? { scoreIri: null } : score)}
              selected={score.scoreIri === selectedScore.scoreIri}
            >
              <ListItemIcon>
                <Avatar>
                  <AudioFile />
                </Avatar>
              </ListItemIcon>
              <ListItemText primary={score.scoreTitle} secondary={score.scoreIri.slice(baseUrlLength)} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <CardActions>
        <Button size="small" disabled={!selectedScore.scoreIri} onClick={() => dispatch(setScore(selectedScore))}>
          Open score
        </Button>
        {scoreIri && <Navigate to="/score" />}
      </CardActions>
    </Card>
  )
}
