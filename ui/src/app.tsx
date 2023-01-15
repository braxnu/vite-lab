import React, { useEffect, useState } from 'react'
import { Search } from './search'
// import { GoogleLogin } from '@react-oauth/google'
import { getJSON } from './utils'
import { User } from '../../shared/types'
import {
  AppBar,
  Box,
  Button,
  FormControl,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { LoginForm } from './login-form'
import { Edit } from './edit'

enum Tabs {
  Search,
  Edit,
}

export function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [currentTab, setCurrentTab] = useState<Tabs>(Tabs.Search)
  const isSmallScreen = useMediaQuery('(max-width: 600px)');

  useEffect(() => {
    getJSON<User>('/api/me')
      .then(user => {
        setUser(user)
        setIsLoading(false)
      })
      .catch(err => {
        console.error('ERR', {err})
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return (
      <>Loading...</>
    )
  }

  return user
    ? (
      <>
        <AppBar position="sticky">
          <Toolbar
            sx={{
              gap: '5px',
              flexWrap: isSmallScreen ? 'wrap' : 'nowrap',
            }}
          >
            <Typography
              variant={isSmallScreen ? 'h6' : 'h4'}
              sx={{
                marginRight: '10px',
              }}
            >
              Medyk Lab
            </Typography>

            {/* Top menu */}
            {user?.isAdmin && (
              <>
                <Button
                  variant='text'
                  color='inherit'
                  onClick={() => {
                    setCurrentTab(Tabs.Search)
                  }}
                >
                  Search
                </Button>

                <Button
                  variant='text'
                  color='inherit'
                  onClick={() => {
                    setCurrentTab(Tabs.Edit)
                  }}
                >
                  Edit
                </Button>
              </>
            )}

            <Typography
              variant='caption'
              sx={{
                flexGrow: 1,
                textTransform: 'uppercase',
                textAlign: 'right',
              }}
            >
              {user.email}
            </Typography>

            <Button
              variant='text'
              color='inherit'
              onClick={() => {
                location.assign('/logout')
              }}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '15px',
        }}>
          {(currentTab === Tabs.Search) && (
            <Search />
          )}
          {(currentTab === Tabs.Edit) && (
            <Edit />
          )}
        </Box>
      </>
    )
    : (
      <FormControl
        sx={{
          flexDirection: 'column',
          display: 'flex',
          alignContent: 'center',
          flexWrap: 'wrap',
          height: '90vh',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        {/* <GoogleLogin
          ux_mode="redirect"
          login_uri="https://medyk-lab.braxnu.com/callback"
          onSuccess={response => {
            console.log({response})
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        /> */}

        <LoginForm />
      </FormControl>
    )
}
