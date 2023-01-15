import React, { useState } from 'react'
import { Button, Paper, TextField } from '@mui/material'
import { postJSON } from './utils'

export const LoginForm = () => {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')

  // @ts-ignore
  const handleLogin = (ev) => {
    if (ev.type === 'keypress' && ev.key !== 'Enter') {
      return
    }

    ev.preventDefault()

    postJSON('/auth', {
      login,
      password,
    })
      .then(() => {
        location.reload()
      })
      .catch(err => {
        console.log('LOGIN ERR', {err})
      })
  }

  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        padding: '16px',
      }}
    >
      <TextField
        required
        value={login}
        label="Login"
        onChange={ev => setLogin(ev.target.value)}
        onKeyPress={handleLogin}
      />

      <TextField
        required
        value={password}
        label="Password"
        type="password"
        onChange={ev => setPassword(ev.target.value)}
        onKeyPress={handleLogin}
      />

      <Button
        variant="contained"
        onClick={handleLogin}
      >
        Login
      </Button>
    </Paper>
  )
}
