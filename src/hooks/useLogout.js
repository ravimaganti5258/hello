import {useDispatch, useSelector} from 'react-redux';

import {HIDE_LOGOUT_MODAL, SHOW_LOGOUT_MODAL} from '../redux/auth/types';

export const useLogout = () => {
  const dispatch = useDispatch();
  const showLogoutModal = useSelector(
    (state) => state?.authReducer?.showLogoutModal,
  );
  const toggleLogoutModal = () => {
    try {
      showLogoutModal
        ? dispatch({type: HIDE_LOGOUT_MODAL})
        : dispatch({type: SHOW_LOGOUT_MODAL});
    } catch (error) {}
  };

  return {showLogoutModal, toggleLogoutModal};
};
