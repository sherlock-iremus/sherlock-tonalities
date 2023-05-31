import { AccountCircle, Logout } from '@mui/icons-material'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  ListItemIcon,
  MenuItem,
  Tooltip,
} from '@mui/material'
import { Box } from '@mui/system'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu } from '../components/Menu'
import { getIri } from '../utils'
import { ContributorItem } from './items/ContributorItem'
import { BASE_API_URL, useGetUserIdQuery } from '../services/service'

export const AccountMenu = () => {
  const { data: userId } = useGetUserIdQuery()
  const [anchorEl, setAnchorEl] = useState(null)
  const [isEditing, setIsEditing] = useState(null)
  const open = Boolean(anchorEl)
  const navigate = useNavigate()

  const handleClose = () => setAnchorEl(null)

  const logOut = () => {
    document.cookie = `JWT=; path=/; expires=${new Date(0).toUTCString()}`
    document.cookie = `JWT_REFRESH_TOKEN=; path=/; expires=${new Date(0).toUTCString()}`
    navigate(0)
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
        <MenuItem onClick={logOut}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      <Dialog open={isEditing} onClose={() => setIsEditing(false)}>
        <DialogTitle>My Sherlock profile</DialogTitle>
        <DialogContent></DialogContent>
      </Dialog>
    </Box>
  )
}
