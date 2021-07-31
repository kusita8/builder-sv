import { writable } from "svelte/store";
import type { Dimensions } from "../global";

export const DimensionsStore = (() => {
  const { subscribe, set, update } = writable({ width: 1440, height: 700 } as Dimensions);

  const updateValue = (key, value) => {
    update(dimensions => {
      dimensions[key] = value;
      return dimensions
    })
  }

  return {
    subscribe,
    set,
    update,
    setWidth: width => updateValue('width', width),
    setHeigth: height => updateValue('height', height)
  }
})();
