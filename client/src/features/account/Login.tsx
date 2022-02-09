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
import agent from '../../app/api/agent';
import { FieldValues, useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useAppDispatch } from '../../app/store/configureStore';
import { signInUser } from './accountSlice';

const theme = createTheme();

export default function Login() {

    const history = useHistory();
    const dispatch = useAppDispatch();

    const {register, handleSubmit, formState: {isSubmitting, errors, isValid}} = useForm({
        mode: 'onChange'
    })

    async function submitForm(data: FieldValues) {
        await dispatch(signInUser(data));
        history.push('/catalog');
    }

// instead of this im using react-hook-form
//     const [values, setValues] = React.useState({
//         username: '',
//         password: ''
//     })
//   const handleSubmit = (event: any) => {
//       event.preventDefault();
//       agent.Account.login(values);
//   };
//   function handleInputChange(event: any) {
//       const {name, value} = event.target;
//       setValues({...values, [name]: value});
//   }

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
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit(submitForm)} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
            //   id="username"
              label="Username"
            //   autoComplete="email"
              autoFocus
            //   onChange={handleInputChange}
            //   value={values.username}
              {...register('username', {required: 'Username is required'})}
              error={!!errors.username}
              helperText={errors?.username?.message}
            />
            <TextField
              margin="normal"
            //   required
              fullWidth
            //   name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            //   onChange={handleInputChange}
            //   value={values.password}
              {...register('password', {required: 'Password is required'})}
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
              Sign In
            </LoadingButton>
            <Grid container>
              {/* <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid> */}
              <Grid item>
                <Link to='/register' >
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
      </Container>
    </ThemeProvider>
  );
}
