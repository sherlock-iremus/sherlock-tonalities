import { InputBase, alpha, styled } from '@mui/material'

const Container = styled('div')(({ theme }) => ({
  position: 'relative',
  margin: theme.spacing(1),
  borderRadius: 8,
  display: 'flex',
  backgroundColor: alpha(theme.palette.secondary.dark, 0.15),
  outline: 'solid ' + theme.palette.primary[100],
  '&:hover': {
    backgroundColor: alpha(theme.palette.secondary.dark, 0.25),
  },
}))

const TextField = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  flex: 1,
  '& .MuiInputBase-input': {
    fontSize: 14,
    padding: theme.spacing(1),
  },
}))

export const Input = props => (
  <Container>
    <TextField {...props} />
  </Container>
)
