import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./use-auth";
import { useBackend } from "./use-backend";

export interface UseAdminReturn {
  isAdmin: boolean;
  adminPrincipal: string | null;
  isLoading: boolean;
}

export function useAdmin(): UseAdminReturn {
  const { actor, isFetching } = useBackend();
  const { isAuthenticated } = useAuth();

  const { data: adminCheck, isLoading: isCheckLoading } = useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isAdmin();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    staleTime: 30_000,
  });

  const { data: adminPrincipal, isLoading: isPrincipalLoading } = useQuery({
    queryKey: ["adminPrincipal"],
    queryFn: async () => {
      if (!actor) return null;
      const p = await actor.getAdminPrincipal();
      return p ? p.toString() : null;
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });

  return {
    isAdmin: adminCheck ?? false,
    adminPrincipal: adminPrincipal ?? null,
    isLoading: isCheckLoading || isPrincipalLoading,
  };
}
