import * as yup from 'yup';

export const signUpSchema = yup.object().shape({
  firstName: yup.string().required('FirstName is required'),
  lastName: yup.string().required('LastName is required'),
  email: yup
    .string()
    .email('Incorrect email format')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Minimum of 6 characters')
    .max(12, 'Maximum of 12 characters')
    .required('Password is required'),
});
