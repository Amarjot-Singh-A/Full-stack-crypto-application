import * as yup from 'yup';

export const signInSchema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid Email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Minimum of 6 characters')
    .max(12, 'Maximum of 12 characters')
    .required('Password is required'),
});
