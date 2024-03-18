'use client';

import useAuthStore from '@/lib/stores/AuthStore';
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';

type _LoginBoxState = {
  username: string;
  usernameError: string | null;
  password: string;
  passwordError: string | null;
  generalError: string | null;
};

const LoginBox = () => {
  const login = useAuthStore(state => state.login);

  const [state, setState] = useState<_LoginBoxState>({
    username: '',
    password: '',
    usernameError: null,
    passwordError: null,
    generalError: null,
  });

  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <>
      <Paper
        sx={{
          padding: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '40%',
        }}
        elevation={3}
      >
        <Typography variant='h5'>RDFCraft</Typography>
        <form
          onSubmit={async e => {
            e.preventDefault();
            let usernameError = null;
            let passwordError = null;
            if (!state.username) {
              usernameError = 'Username is required';
            }
            if (!state.password) {
              passwordError = 'Password is required';
            }
            if (!state.username || !state.password) {
              setState({ ...state, usernameError, passwordError });
              return;
            }
            let result = await login(state.username, state.password);
            if (result) {
              setState({ ...state, generalError: result });
              return;
            }
          }}
        >
          <Box
            sx={{
              padding: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {state.generalError && (
              <Alert severity='error'>
                <Typography variant='h6'>Error</Typography>
                <Typography>{state.generalError}</Typography>
              </Alert>
            )}
            <Box sx={{ height: 8 }} />
            <TextField
              fullWidth
              label='Username'
              value={state.username}
              type='username'
              onChange={e => setState({ ...state, username: e.target.value })}
              error={!!state.usernameError}
              helperText={state.usernameError}
            />
            <Box sx={{ height: 8 }} />
            <TextField
              fullWidth
              label='Password'
              value={state.password}
              type={passwordVisible ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={() => setPasswordVisible(!passwordVisible)}
                    >
                      {passwordVisible ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onChange={e => setState({ ...state, password: e.target.value })}
              error={!!state.passwordError}
              helperText={state.passwordError}
            />
            <Box sx={{ height: 8 }} />
            <Button type='submit' variant='contained'>
              Login
            </Button>
          </Box>
        </form>
      </Paper>
    </>
  );
};

export default LoginBox;
