import { useMutation } from '@tanstack/react-query';
import { sendData } from '../../../services/dataInteraction';

export function useLogOut() {
  const logoutURL = `${process.env.REACT_APP_API_URL}/users/logout`;

  return useMutation((values) => sendData(values, logoutURL));
}
