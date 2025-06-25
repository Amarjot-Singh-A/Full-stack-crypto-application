import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { signUpSchema } from './SignUpSchema';
import { useFormik } from 'formik';
import { Link, useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { useSignUp } from './useSignUp';
import { signUp } from '../../../app/store';

const theme = createTheme();

export default function SignUp() {
  const history = useHistory();
  const signUpMutation = useSignUp();
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
    validationSchema: signUpSchema,
    onSubmit: async (values) => {
      signUpMutation.mutate(values, {
        onSuccess: (dataReturn) => {
          if (dataReturn.error && !dataReturn.isLoggedIn) {
            Swal.fire({
              title: 'Sign Up Attempt Failed',
              icon: 'error',
              html: 'Please sign up again',
              timer: 2000,
              timerProgressBar: true,
              didOpen: () => {
                Swal.showLoading();
              },
            });
          } else {
            dispatch(signUp({ email: values.email }));
            Swal.fire({
              title: 'Sign Up Successful',
              icon: 'success',
              html: 'Redirecting to Home',
              timer: 2000,
              timerProgressBar: true,
              didOpen: () => {
                Swal.showLoading();
              },
            }).then(() => {
              history.push('/dashboard', {
                isLoggedIn: `${dataReturn.isLoggedIn}`,
              });
            });
          }
        },
        onError: (error) => {
          console.error('Sign Up error:', error);
          Swal.fire({
            title: 'Sign Up Attempt Failed',
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
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={formik.handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="fname"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  autoFocus
                />

                {formik.touched.firstName && formik.errors.firstName ? (
                  <div style={{ color: 'red' }}>{formik.errors.firstName}</div>
                ) : null}
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  autoComplete="lname"
                />

                {formik.touched.lastName && formik.errors.lastName ? (
                  <div style={{ color: 'red' }}>{formik.errors.lastName}</div>
                ) : null}
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  autoComplete="email"
                />

                {formik.touched.email && formik.errors.email ? (
                  <div style={{ color: 'red' }}>{formik.errors.email}</div>
                ) : null}
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  autoComplete="new-password"
                />

                {formik.touched.password && formik.errors.password ? (
                  <div style={{ color: 'red' }}>{formik.errors.password}</div>
                ) : null}
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/">Already have an account? Sign in</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
