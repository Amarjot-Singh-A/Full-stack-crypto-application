import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { logout } from '../../../app/store';
import { useLogOut } from './useLogOut';

export default function LogOut() {
  const history = useHistory();
  const dispatch = useDispatch();
  const logOutMutation = useLogOut();
  const handleLogOut = () => {
    logOutMutation.mutate(
      {},
      {
        onSuccess: (dataReturn) => {
          if (dataReturn.error) {
            Swal.fire({
              title: 'Logout Attempt Failed',
              icon: 'error',
              html: 'Please try again',
              timer: 2000,
              timerProgressBar: true,
              didOpen: () => {
                Swal.showLoading();
              },
            });
          } else {
            dispatch(logout());
            Swal.fire({
              title: 'Logout Successful',
              icon: 'success',
              html: 'Redirecting to Sign In',
              timer: 2000,
              timerProgressBar: true,
              didOpen: () => {
                Swal.showLoading();
              },
            }).then(() => {
              history.push('/');
            });
          }
        },
        onError: (error) => {
          console.error('Logout error:', error);
          Swal.fire({
            title: 'Logout Attempt Failed',
            icon: 'error',
            html: 'Please try again later',
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading();
            },
          });
        },
      },
    );
  };

  return handleLogOut;
}
