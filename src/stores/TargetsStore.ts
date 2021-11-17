import { writable } from "svelte/store"
import type { Target } from "../global";

export const TargetsStore = (() => {
  const { subscribe, update } = writable([
    {
      media: "ALL",
      copy: "ALL",
    },
    {
      media: "(min-width: 768px)",
      copy: "Min width: 768px",
    },
    {
      media: "(min-width: 1024px)",
      copy: "Min width: 1024px",
    },
    {
      media: "",
      copy: "Add custom...",
    },
  ] as Target[]);


  return {
    subscribe,
    add: (newTarget: Target, index: number) => {
      update(store => {
        const storeCopy = [...store];

        storeCopy.splice(index, 0, newTarget);

        return storeCopy;
      })
    }
  }

})()