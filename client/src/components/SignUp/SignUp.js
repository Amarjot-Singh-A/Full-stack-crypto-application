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
import { signUpSchema } from '../../schemas/SignUpSchema';
import { useFormik } from 'formik';
import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';

const interactions = require('../../services/dataInteraction');
const theme = createTheme();

export default function SignUp() {
  const [dataResp, setDataResp] = useState('');
  const [signUpError, setSignUpError] = useState('');
  const history = useHistory();

  const SignUpURL = 'http://localhost:5000/users/signup';

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
    validationSchema: signUpSchema,
    onSubmit: async (values) => {
      const dataReturn = await interactions.sendData(values, SignUpURL);
      if (Boolean(dataReturn.error) && !dataReturn.loggedIn) {
        setDataResp(dataReturn.loggedIn.toString());
        setSignUpError(dataReturn.error);
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
        setDataResp(dataReturn.loggedIn.toString());
        Swal.fire({
          title: 'Sign Up Successful',
          icon: 'success',
          html: 'Redirecting to Home',
          timer: 2000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
          },
        }).then((result) => {
          history.push('/dashboard', { isLogged: `${dataReturn.loggedIn}` });
        });
      }
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
          <Typography component="h5" variant="h5" style={{ color: 'green' }}>
            Sign up Successful = {dataResp}
          </Typography>
          <Typography component="h5" variant="h5" style={{ color: 'red' }}>
            {signUpError}
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
