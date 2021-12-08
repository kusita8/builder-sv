import { writable } from "svelte/store";

export const HighlightStore = (() => {
  const { subscribe, update, set } = writable({} as any);

  return {
    subscribe,
    set,
    refresh: (timeout?: number) => setTimeout(() => update(a => a), timeout || 0),
  }
})();