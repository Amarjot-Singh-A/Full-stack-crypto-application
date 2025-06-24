import { useMutation } from '@tanstack/react-query';
import { sendData } from '../../../services/dataInteraction';

export function useSignIn() {
  const signInURL = `${process.env.REACT_APP_API_URL}/users/signin`;

  return useMutation((values) => sendData(values, signInURL));
}
