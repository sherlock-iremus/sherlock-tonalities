import { Typography } from '@mui/material'

export const Intro = () => (
  <Typography textAlign="justify" component="span" color="text.secondary" px={2} overflow="scroll" fontSize={14}>
    This interface leverages web technologies to grasp how distinct theoretical viewpoints bring to light different,
    sometimes conflicting musical properties; confront different interpretations; and, ultimately, provide documented
    and authored analyses of musical pieces. To this end, Tonalities (a) makes use of theoretical models, which (b) can
    be associated with arbitrary selections on the score and (c) lead to critical analyses through collaborative
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
      conflicting — musical properties; to confront different analytical interpretations; to look “inside” both theories
      and works; to understand how both evolve in time in relation to each other; and ultimately to provide an argued,
      documented and authored modal-tonal classification of musical pieces.
    </p>
  </Typography>
)
