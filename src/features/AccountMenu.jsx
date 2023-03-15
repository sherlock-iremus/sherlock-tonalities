import { Logout, PersonAdd, Settings } from '@mui/icons-material'
import { Button, IconButton, ListItemIcon, Menu, MenuItem, Tooltip } from '@mui/material'
import { Box } from '@mui/system'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BASE_API_URL, useGetUserIdQuery } from '../app/services/sherlockApi'
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
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          New analytical project
        </MenuItem>
        <MenuItem onClick={() => (window.location.href = 'https://data-iremus.huma-num.fr/sherlock/me')}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Profile info
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
