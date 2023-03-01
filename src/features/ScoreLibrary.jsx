import { AudioFile } from '@mui/icons-material'
import {
  Avatar,
  Box,
  Button,
  Card,
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
import cover from '../assets/bg-score.jpg'
import { useNavigate } from 'react-router-dom'
import { getUuidFromSherlockIri } from './score/utils'

export const ScoreLibrary = () => {
  const navigate = useNavigate()
  const { isUserConnected } = useSelector(state => state.score)

  return (
    <Card sx={{ maxWidth: 500 }}>
      <CardMedia component="img" height="140" image={cover} alt="score" />
      {!isUserConnected ? (
        <CardContent>
          <Box sx={{ display: 'flex' }}>
            <Typography variant="h5">Tonalities</Typography>
            <Typography variant="h6" sx={{ fontSize: 12 }}>
              2.0
            </Typography>
          </Box>
          <Box sx={{ overflow: 'auto', maxHeight: 300 }}>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'justify' }}>
              <p>
                The modal-tonal organization of European music is decisive for its structural properties, its inner
                coherence, its dramatic plot and, ultimately, for its artistic meaning. TONALITIES embraces the open
                linked data paradigm to reference large corpora of music made available in digital score libraries and
                to explore them through a quantitative-qualitative approach. This approach consists of modeling
                different theories — historical or contemporary, specific or general — and applying them to musical
                works through a dedicated interface combining machine learning and human annotations.
              </p>
              <p>
                This interface addresses the following challenges:
                <ul>
                  <li>select different models, corresponding to different theoretical and analytical viewpoints</li>
                  <li>
                    select every item on the score (verticalities, groups of notes, etc.) at any level of granularity
                  </li>
                  <li>
                    create arbitrary selection trees through nested selections, edit a selection or add/remove elements
                    (including other selections)
                  </li>
                  <li>associate concepts derived from the models with these analytical elements</li>
                  <li>comment on the analytical annotations</li>
                  <li>
                    compare the annotations made on the same score either by different users or on the basis of
                    different models
                  </li>
                </ul>
              </p>
              <p>
                It thus becomes possible to grasp how distinct theoretical viewpoints bring to light
                different — sometimes conflicting — musical properties; to confront different analytical
                interpretations; to look “inside” both theories and works; to understand how both evolve in time in
                relation to each other; and ultimately to provide an argued, documented and authored modal-tonal
                classification of musical pieces.
              </p>
            </Typography>
          </Box>
          <Box sx={{ paddingTop: 2, textAlign: 'center' }}>
            <Button
              href={`http://data-iremus.huma-num.fr/sso?redirect-uri=${window.location.href}`}
              variant="contained"
              color="success"
            >
              Login with Orcid
            </Button>
          </Box>
        </CardContent>
      ) : (
        <List
          subheader={<ListSubheader>Available scores</ListSubheader>}
          dense
          disablePadding
          sx={{ overflow: 'auto', maxHeight: 300 }}
        >
          {scores.map(score => (
            <ListItem key={score.scoreIri} disablePadding>
              <ListItemButton onClick={() => navigate(`/score/${getUuidFromSherlockIri(score.scoreIri)}`)}>
                <ListItemIcon>
                  <Avatar>
                    <AudioFile />
                  </Avatar>
                </ListItemIcon>
                <ListItemText primary={score.scoreTitle} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Card>
  )
}
