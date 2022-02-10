import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Alert, AlertTitle, LoadingButton } from '@mui/lab';
import { useAppDispatch, useAppSelector } from '../../app/store/configureStore';
import agent from '../../app/api/agent';
import { useState } from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import { toast } from 'react-toastify';

const theme = createTheme();

export default function Register() {

    const {user} = useAppSelector(state => state.account);
    const history = useHistory();
    const dispatch = useAppDispatch();

    const {register, handleSubmit, setError, formState: {isSubmitting, errors, isValid}} = useForm({
        mode: 'all'
    })

    function hadleApiErrors(errors: any) {
        if (errors) {
            errors.forEach(error => {
                if (error.includes('Password')) {
                    setError('password', {message: error})
                } else if (error.includes('Email')) {
                    setError('email', {message: error})
                } else if (error.includes('Username')) {
                    setError('username', {message: error})
                }
            });
        }
    }

  if (user) {
    history.push('/catalog');
    return(
      <h6>Already logged in, redirecting to shop...</h6>
    );
  } else {
    return (
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs" sx={{display: 'flex', alignItems: 'center', p: 4}}>
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Register
            </Typography>
            <Box component="form" 
                onSubmit={
                    handleSubmit((data) => agent.Account.register(data)
                        .then(() => {
                            toast.success('Registration successfull. You can now Login');
                            history.push('/login')
                        })
                        .catch(error => hadleApiErrors(error)))
                } 
                noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Username"
                autoFocus
                {...register('username', {required: 'Username is required'})}
                error={!!errors.username}
                helperText={errors?.username?.message}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email"
                {...register('email', {
                    required: 'Email is required',
                    pattern: {
                        value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                        message: 'Not a valid email address'
                    }
                })}
                error={!!errors.email}
                helperText={errors?.email?.message}
              />
              <TextField
                margin="normal"
                fullWidth
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                {...register('password', {
                    required: 'Password is required',
                    pattern: {
                        value:/(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/,
                        message: 'Password does not meet complexity requirements.'
                    }
                })}
                error={!!errors.password}
                helperText={errors?.password?.message}
              />
              <LoadingButton
              
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                loading={isSubmitting}
                disabled={!isValid}
              >
                Register
              </LoadingButton>
              <Grid container>
                {/* <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid> */}
                <Grid item>
                  <Link to='/login' >
                    {"Already have an account? Sign In"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
        </Container>
      </ThemeProvider>
    )  
  }
}
