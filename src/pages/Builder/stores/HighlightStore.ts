import { writable } from "svelte/store";
import { debounce } from "../util/debounce";

export const HighlightStore = (() => {
  const { subscribe, update, set } = writable({} as any);

  return {
    subscribe,
    set,
    refresh: debounce(() => {
      update((a) => a);
    }),
    clear: () => {
      update(() => ({}));
    },
  };
})();
