import { useMutation } from '@tanstack/react-query';
import { sendData } from '../../../services/dataInteraction';

export function useSignUp() {
  const signUpURL = `${process.env.REACT_APP_API_URL}/users/signup`;

  return useMutation((values) => sendData(values, signUpURL));
}
