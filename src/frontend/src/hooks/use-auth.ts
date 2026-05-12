import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import type { Principal } from "@icp-sdk/core/principal";
import { useCallback } from "react";

export interface UseAuthReturn {
  principal: Principal | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  principalText: string | null;
}

export function useAuth(): UseAuthReturn {
  const { identity, isAuthenticated, isLoggingIn, login, clear } =
    useInternetIdentity();

  const principal =
    isAuthenticated && identity ? identity.getPrincipal() : null;
  const principalText = principal ? principal.toString() : null;

  const logout = useCallback(() => {
    clear();
  }, [clear]);

  return {
    principal,
    isAuthenticated,
    isLoading: isLoggingIn,
    login,
    logout,
    principalText,
  };
}
