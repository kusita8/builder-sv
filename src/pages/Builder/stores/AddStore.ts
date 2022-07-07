import { writable } from "svelte/store";
import type { Item } from "../../../global";

export const AddStore = (() => {
  const base = {
    parent: null as Item,
  };
  const { subscribe, set } = writable(base);

  return {
    subscribe,
    set: (parent) => {
      set({ parent });
    },
    clear: () => {
      set(base);
    },
  };
})();
