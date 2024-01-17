import { AccountCircle, BugReport, Logout } from '@mui/icons-material'
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  ListItemIcon,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  useTheme,
} from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu } from '../components/Menu'
import { colors, getIri } from '../utils'
import { ContributorItem } from './items/ContributorItem'
import { BASE_API_URL, useGetUserIdQuery, usePutUserMutation } from '../services/service'
import { useDispatch } from 'react-redux'
import { setColorIndex } from '../services/globals'
import { useGetContributorQuery } from '../services/sparql'

export const AccountMenu = () => {
  const theme = useTheme()
  const { data: userId } = useGetUserIdQuery()
  const { data: contributor, refetch } = useGetContributorQuery(getIri(userId), { skip: !userId })
  const [selectedEmoji, setSelectedEmoji] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [putUser, { isLoading }] = usePutUserMutation()
  const [anchorEl, setAnchorEl] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const open = Boolean(anchorEl)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleClose = () => setAnchorEl(null)

  const logOut = () => {
    document.cookie = `JWT=; path=/; expires=${new Date(0).toUTCString()}`
    document.cookie = `JWT_REFRESH_TOKEN=; path=/; expires=${new Date(0).toUTCString()}`
    navigate(0)
  }

  useEffect(() => {
    setSelectedEmoji(contributor?.emoji)
    setSelectedColor(contributor?.color)
  }, [contributor])

  const updateUser = async () => {
    if (!isLoading)
      try {
        const body = { color: selectedColor.slice(1), emoji: selectedEmoji }
        await putUser(body)
        refetch()
      } catch (error) {
        console.log(error)
      }
  }

  return !userId ? (
    <Dialog open>
      <DialogTitle>It's been a while...</DialogTitle>
      <DialogActions>
        <Button
          href={BASE_API_URL + `sherlock/login?redirect-uri=${window.location.href}`}
          variant="contained"
          size="small"
        >
          Login
        </Button>
      </DialogActions>
    </Dialog>
  ) : (
    <Box>
      <Tooltip title="Account">
        <IconButton
          onClick={e => setAnchorEl(e.currentTarget)}
          size="small"
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <ContributorItem contributorIri={getIri(userId)} />
        </IconButton>
      </Tooltip>
      <Menu anchorEl={anchorEl} id="account-menu" open={open} onClose={handleClose} onClick={handleClose}>
        <MenuItem onClick={() => setIsEditing(true)}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          My account
        </MenuItem>
        <MenuItem onClick={() => window.open('https://github.com/sherlock-iremus/sherlock-tonalities/issues/new')}>
          <ListItemIcon>
            <BugReport fontSize="small" />
          </ListItemIcon>
          Report a bug
        </MenuItem>
        <MenuItem onClick={logOut}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      <Dialog open={isEditing} onClose={() => setIsEditing(false)}>
        <DialogTitle>My Sherlock profile</DialogTitle>
        <DialogContent>
          <DialogContentText paddingY={1}>Account informations</DialogContentText>
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar sx={{ height: 50, width: 50, bgcolor: selectedColor }}>
              <TextField
                value={selectedEmoji}
                onChange={e => setSelectedEmoji(e.target.value[0])}
                inputProps={{ min: 0, style: { textAlign: 'center', color: 'white' } }}
              />
            </Avatar>
            <Stack flex={1} direction="row">
              {colors.map((color, index) => (
                <IconButton
                  size="large"
                  key={index}
                  sx={{ bgcolor: selectedColor === color[500] ? color[100] : color[500] }}
                  onClick={() => setSelectedColor(color[500])}
                />
              ))}
            </Stack>
          </Stack>
          <Stack>
            <Button onClick={updateUser} disabled={isLoading}>
              Save profile
            </Button>
          </Stack>
          <DialogContentText paddingY={1}>Interface theme</DialogContentText>
          <Stack flex={1} direction="row">
            {colors.map((color, index) => (
              <IconButton
                size="large"
                key={index}
                sx={{ bgcolor: theme.palette.primary.main === color[500] ? color[100] : color[500] }}
                onClick={() => dispatch(setColorIndex(index))}
              />
            ))}
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  )
}
