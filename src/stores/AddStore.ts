import { writable } from "svelte/store"
import type { Item } from "../global";


export const AddStore = (() => {
  const components = [];
  const base = {
    parent: null as Item,
    components,
    hasComponets: false
  }
  const { subscribe, set } = writable(base);

  return {
    subscribe,
    set: (parent) => {
      set({ parent, components, hasComponets: components.length !== 0 })
    },
    addComponent: (item: Item) => {
      components.push(item)
    },
    clear: () => {
      set(base)
    }
  }
})()