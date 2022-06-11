import { writable } from "svelte/store";
import type { Target } from "../global";

export const TargetsStore = (() => {
  const DEFAULT_TARGETS = [
    {
      copy: "None",
      media: "ALL",
    },
    {
      copy: "768px",
      media: "(min-width: 768px)",
    },
    {
      copy: "Add custom...",
      media: "",
    },
  ] as Target[];

  const { subscribe, update } = writable({
    MAX: DEFAULT_TARGETS,
    MIN: DEFAULT_TARGETS,
  });

  return {
    subscribe,
    add: (newTarget: Target, target: string) => {
      update((store) => {
        const targetCopy = [...store[target]];

        targetCopy.splice(targetCopy.length - 1, 0, newTarget);

        store[target] = targetCopy;

        return store;
      });
    },
  };
})();
