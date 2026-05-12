import { useActor } from "@caffeineai/core-infrastructure";
import { createActor } from "../backend-client";
import type { backendInterface } from "../backend-client";

export interface UseBackendReturn {
  actor: backendInterface | null;
  isFetching: boolean;
}

export function useBackend(): UseBackendReturn {
  const { actor, isFetching } = useActor(createActor);
  return { actor: actor as backendInterface | null, isFetching };
}
