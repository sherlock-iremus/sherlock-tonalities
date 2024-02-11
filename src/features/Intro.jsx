import { Stack, Typography } from '@mui/material'

export const Intro = () => (
  <Stack flex={1} overflow="scroll" padding={2}>
    <Typography textAlign="justify" component="span" color="text.secondary" fontSize={14}>
      This interface leverages web technologies to grasp how distinct theoretical viewpoints bring to light different,
      sometimes conflicting musical properties; confront different interpretations; and, ultimately, provide documented
      and authored analyses of musical pieces. To this end, Tonalities (a) makes use of theoretical models, which (b)
      can be associated with arbitrary selections on the score and (c) lead to critical analyses through collaborative
      approaches.
      <p>The interface addresses the following challenges:</p>
      <ul>
        <li>select different models, corresponding to different theoretical and analytical viewpoints</li>
        <li>select every item on the score (verticalities, groups of notes, etc.) at any level of granularity</li>
        <li>
          create arbitrary selection trees through nested selections, edit a selection or add/remove elements (including
          other selections)
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
    <Typography variant="subtitle1" pt={2}>
      Presentation of the annotation interface and note selection
    </Typography>
    <video width="640" height="400" controls>
      <source src="https://streaming.ccsd.cnrs.fr/04/09/37/12/tonalities_V2_demo_2.mp4" />
    </video>
    <Typography variant="subtitle1" pt={2}>
      Annotation of a cadence with its individual melodic lines and cadence steps
    </Typography>
    <div>
      <iframe
        frameBorder="0"
        src="https://drive.google.com/file/d/1OUOI9tMyQs3u1H_0FBJNuaqzaTcOxtAf/preview"
        allowFullScreen
        width="640"
        height="400"
      ></iframe>
    </div>
    <Typography variant="subtitle1" pt={2}>
      Annotation of the exposition, episodes and coda of a fugue
    </Typography>
    <div>
      <iframe
        frameBorder="0"
        src="https://drive.google.com/file/d/1U4pnRmpRcBv3ZivSIt1bAQBv3qu5DECZ/preview"
        allowFullScreen
        width="640"
        height="400"
      ></iframe>
    </div>
  </Stack>
)
