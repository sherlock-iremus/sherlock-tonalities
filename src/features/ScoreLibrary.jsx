import { AudioFile } from '@mui/icons-material'
import {
  Avatar,
  Box,
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
import { useSelector } from 'react-redux'
import scores from '../app/scores.json'
import cover from '../images/bg-score.jpg'
import { useState } from 'react'
import { useGetUserIdQuery } from '../app/services/sherlockApi'
import { DISCONNECTED } from './score/constants'
import { useNavigate } from 'react-router-dom'
import { getUuidFromSherlockIri } from './score/utils'

export const ScoreLibrary = () => {
  const navigate = useNavigate()
  const { data: userId } = useGetUserIdQuery()
  const isUserConnected = userId !== DISCONNECTED
  const { scoreIri } = useSelector(state => state.score)
  const [selectedScoreIri, setSelectedScoreIri] = useState(scoreIri)
  const baseUrlLength = useSelector(state => state.score.baseUrl.length)
  return (
    <Card sx={{ maxWidth: 400, maxHeight: 700 }}>
      <CardMedia component="img" height="140" image={cover} alt="score" />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Pilot <i>Tonalities</i>
        </Typography>
        {!isUserConnected && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'justify' }}>
            Tonalities is developing tools for the modal-tonal identification, exploration and classification of
            monophonic and polyphonic notated music from the Renaissance to the 20th century.
            <br />
            The pilot has a broader societal and pedagogical dimension: it does not only impact research on the theory
            and evolution of the musical language but is also relevant for the understanding of music collections by
            students, performers, and informed music lovers.
            <br />
            The recording industry is a potential target for the classification of works and the constitution of
            playlists.
          </Typography>
        )}
      </CardContent>
      {isUserConnected ? (
        <>
          <List
            subheader={<ListSubheader>Available scores</ListSubheader>}
            dense
            disablePadding
            sx={{ maxHeight: 300, overflow: 'auto' }}
          >
            {scores.map(score => (
              <ListItem key={score.scoreIri} disablePadding>
                <ListItemButton
                  onClick={() =>
                    setSelectedScoreIri(score.scoreIri)
                  }
                  selected={score.scoreIri === selectedScoreIri}
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
            <Button size="small" disabled={!selectedScoreIri} onClick={() => navigate(`/score/${getUuidFromSherlockIri(selectedScoreIri)}`)}>
              Open score
            </Button>
          </CardActions>
        </>
      ) : (
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Button
            href={`http://data-iremus.huma-num.fr/sso?redirect-uri=${window.location.href}`}
            variant="contained"
            color="success"
          >
            Login with Orcid
          </Button>
        </Box>
      )}
    </Card>
  )
}
