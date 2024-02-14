import { DialerSip, PlayCircle } from '@mui/icons-material'
import { Dialog, DialogTitle, Grid, Stack, Typography } from '@mui/material'
import { useState } from 'react'

export const Intro = () => {
  const [openedTutorial, setOpenedTutorial] = useState(null)
  const tutorials = [
    {
      title: 'Presentation of the annotation interface and note selection',
      url: 'https://streaming.ccsd.cnrs.fr/04/09/37/12/tonalities_V2_demo_2.mp4',
    },
    {
      title: 'Annotation of a cadence with its individual melodic lines and cadence steps',
      url: 'https://drive.google.com/file/d/1OUOI9tMyQs3u1H_0FBJNuaqzaTcOxtAf/preview',
    },
    {
      title: 'Annotation of the exposition, episodes and coda of a fugue',
      url: 'https://drive.google.com/file/d/1U4pnRmpRcBv3ZivSIt1bAQBv3qu5DECZ/preview',
    },
  ]
  return (
    <Stack flex={1} overflow="scroll" padding={2}>
      <Typography textAlign="justify" component="span" color="text.secondary" fontSize={14}>
        This interface leverages web technologies to grasp how distinct theoretical viewpoints bring to light different,
        sometimes conflicting musical properties; confront different interpretations; and, ultimately, provide
        documented and authored analyses of musical pieces. To this end, Tonalities (a) makes use of theoretical models,
        which (b) can be associated with arbitrary selections on the score and (c) lead to critical analyses through
        collaborative approaches.
        <p>The interface addresses the following challenges:</p>
        <ul>
          <li>select different models, corresponding to different theoretical and analytical viewpoints</li>
          <li>select every item on the score (verticalities, groups of notes, etc.) at any level of granularity</li>
          <li>
            create arbitrary selection trees through nested selections, edit a selection or add/remove elements
            (including other selections)
          </li>
          <li>associate concepts derived from the models with these analytical elements</li>
          <li>comment on the analytical annotations</li>
          <li>
            compare the annotations made on the same score either by different users or on the basis of different models
          </li>
        </ul>
        <p>
          It thus becomes possible to grasp how distinct theoretical viewpoints bring to light different — sometimes
          conflicting — musical properties; to confront different analytical interpretations; to look “inside” both
          theories and works; to understand how both evolve in time in relation to each other; and ultimately to provide
          an argued, documented and authored modal-tonal classification of musical pieces.
        </p>
      </Typography>
      <Typography variant="h6">Demos</Typography>
      {tutorials.map(tutorial => (
        <Stack
          flex={1}
          direction="row"
          mt={1}
          onClick={() => setOpenedTutorial(tutorial)}
          p={1}
          bgcolor="secondary.main"
          borderRadius={3}
          alignItems="center"
          sx={({ palette }) => ({
            cursor: 'pointer',
            '&.MuiStack-root:hover': {
              backgroundColor: palette.primary[100],
              outline: 'solid ' + palette.primary[300],
            },
          })}
        >
          <PlayCircle color="primary" />
          <Typography textAlign="center" variant="subtitle1" color="primary">
            {tutorial.title}
          </Typography>
        </Stack>
      ))}
      <Dialog open={!!openedTutorial} onClose={() => setOpenedTutorial(null)}>
        <DialogTitle>{openedTutorial?.title}</DialogTitle>
        <iframe frameBorder="0" src={openedTutorial?.url} allowFullScreen width="640" height="400"></iframe>
      </Dialog>
    </Stack>
  )
}
