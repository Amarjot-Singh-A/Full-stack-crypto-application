import * as React from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../../app/store';
import { useHistory } from 'react-router';
import { useFormik } from 'formik';
import { signInSchema } from './SignInSchema';
import Swal from 'sweetalert2';
import { useSignIn } from './useSignIn';
import { Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

export default function SignIn() {
  const history = useHistory();
  const dispatch = useDispatch();
  const signInMutation = useSignIn();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: signInSchema,
    onSubmit: async (values) => {
      signInMutation.mutate(values, {
        onSuccess: (dataReturn) => {
          if (dataReturn.error) {
            Swal.fire({
              title: 'Login Attempt Failed',
              icon: 'error',
              html: 'Please login again',
              timer: 2000,
              timerProgressBar: true,
              didOpen: () => {
                Swal.showLoading();
              },
            });
          } else {
            dispatch(login({ email: values.email }));
            Swal.fire({
              title: 'Login Successful',
              icon: 'success',
              html: 'Redirecting to Home',
              timer: 2000,
              timerProgressBar: true,
              didOpen: () => {
                Swal.showLoading();
              },
            }).then(() => {
              history.push('/dashboard', {
                isLogged: `${dataReturn.loggedIn}`,
              });
            });
          }
        },
        onError: (error) => {
          console.error('Login error:', error);
          Swal.fire({
            title: 'Login Attempt Failed',
            icon: 'error',
            html: 'Please try again later',
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading();
            },
          });
        },
      });
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar
            sx={{
              m: 1,
              bgcolor: 'secondary.main',
            }}
          >
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            noValidate
            sx={{
              mt: 1,
            }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              value={formik.values.email}
              autoComplete="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              autoFocus
            />

            {formik.touched.email && formik.errors.email ? (
              <div style={{ color: 'red' }}>{formik.errors.email}</div>
            ) : null}

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              value={formik.values.password}
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            {formik.touched.password && formik.errors.password ? (
              <div style={{ color: 'red' }}>{formik.errors.password}</div>
            ) : null}

            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
              }}
            >
              Sign In
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/signup">Already have an account? Sign up</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
