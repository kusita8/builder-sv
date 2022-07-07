import { writable } from "svelte/store";
import type { Target } from "../../../global";
import { defaultTargets } from "../util/defaultTargets";

export const TargetsStore = (() => {
  const defaultValues = {
    MAX: defaultTargets("max"),
    MIN: defaultTargets("min"),
  };
  const { subscribe, update } = writable(defaultValues);

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
