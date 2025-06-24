import * as React from 'react';
import { useState } from 'react';
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
import { useHistory } from 'react-router';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {signInSchema} from './SignInSchema';
import { useFormik } from 'formik';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const interactions = require('../../../services/dataInteraction');
const theme = createTheme();

/**
 * todo - use <Alert severity="error">This is an error alert — check it out!</Alert> to show errors
 * in both signin and signup
 */
export default function SignIn() {
  const history = useHistory();
  const [dataRetrieve, setDataRetrieve] = useState(false);

  const signInURL = `${process.env.REACT_APP_API_URL}/users/signin`;

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: signInSchema,
    onSubmit: async (values) => {
      const dataReturn = await interactions.sendData(values, signInURL);
      console.log('datareturn', dataReturn);
      if (Boolean(dataReturn.error)) {
        setDataRetrieve(dataReturn.loggedIn.toString());
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
        setDataRetrieve(dataReturn.loggedIn.toString());
        Swal.fire({
          title: 'Login Successful',
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
          <Typography component="h5" variant="h5">
            {dataRetrieve}
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
