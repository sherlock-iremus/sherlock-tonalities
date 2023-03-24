import { Typography } from '@mui/material'

export const Intro = () => (
  <Typography textAlign="justify" component="span" color="text.secondary" px={2} overflow="scroll" fontSize={14}>
    The modal-tonal organization of European music is decisive for its structural properties, its inner coherence, its
    dramatic plot and, ultimately, for its artistic meaning. TONALITIES embraces the open linked data paradigm to
    reference large corpora of music made available in digital score libraries and to explore them through a
    quantitative-qualitative approach. This approach consists of modeling different theories — historical or
    contemporary, specific or general — and applying them to musical works through a dedicated interface combining
    machine learning and human annotations.
    <p>This interface addresses the following challenges:</p>
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
