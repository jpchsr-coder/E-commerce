import { useAppSelector, useAppDispatch } from '../store/index';
import { loginUser, logoutUser, signupUser } from '../store/authSlice';
import type { LoginPayload, SignupPayload } from '../types/index';
import { useCallback } from 'react';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error, token } = useAppSelector(
    (state) => state.auth
  );

  const login = useCallback(
    (payload: LoginPayload) => dispatch(loginUser(payload)),
    [dispatch]
  );

  const signup = useCallback(
    (payload: SignupPayload) => dispatch(signupUser(payload)),
    [dispatch]
  );

  const logout = useCallback(() => dispatch(logoutUser()), [dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    token,
    login,
    signup,
    logout,
  };
};
