import { AccountCircle, Logout, PersonAdd } from '@mui/icons-material'
import { Button, IconButton, ListItemIcon, MenuItem, Tooltip } from '@mui/material'
import { Box } from '@mui/system'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BASE_API_URL, useGetUserIdQuery } from '../app/services/sherlockApi'
import { Menu } from '../components/Menu'
import { getSherlockIriFromUuid } from '../utils'
import { ContributorItem } from './items/ContributorItem'

export const AccountMenu = () => {
  const { data: userId } = useGetUserIdQuery()
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const navigate = useNavigate()

  const handleClose = () => setAnchorEl(null)

  const logOut = () => {
    document.cookie = `JWT=; path=/; expires=${new Date(0).toUTCString()}`
    document.cookie = `JWT_REFRESH_TOKEN=; path=/; expires=${new Date(0).toUTCString()}`
    navigate(0)
  }

  return !userId ? (
    <Box>
      <Button href={BASE_API_URL + `oauth/login/orcid`} variant="contained" color="success" size="small">
        Login
      </Button>
    </Box>
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
          <ContributorItem contributorIri={getSherlockIriFromUuid(userId)} />
        </IconButton>
      </Tooltip>
      <Menu anchorEl={anchorEl} id="account-menu" open={open} onClose={handleClose} onClick={handleClose}>
        <MenuItem onClick={() => (window.location.href = 'https://data-iremus.huma-num.fr/sherlock/me')}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          My account
        </MenuItem>
        <MenuItem onClick={logOut} disabled={process.env.NODE_ENV !== 'production'}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  )
}
