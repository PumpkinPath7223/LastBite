import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Convenience wrapper around AuthContext.
 */
export function useAuth() {
  return useContext(AuthContext);
}

export default useAuth;
