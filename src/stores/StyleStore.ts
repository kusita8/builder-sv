import { get, writable } from "svelte/store";
import type { Item, StyleStoreItem } from "../global";
import { ENUMS } from '../enums';
import { HighlightStore } from "./HighlightStore";
import { UserSiteEventsStore } from "./UserSiteEventsStore";

const {
  UPDATE_STYLE,
} = ENUMS.USER_SITE_EVENTS

export const StyleStore = (() => {
  const store = writable({} as StyleStoreItem);
  const { subscribe, update } = store;
  const classNamesCount = {}

  const getClassName = (item) => {
    const items = classNamesCount[item.tag] || [];
    items.push(item.id);
    classNamesCount[item.tag] = items;
    return items.length;
  }

  return {
    subscribe,
    add: (item: Item | null, style: string, target: string) => {
      if (Object.keys(item).length === 0) return;

      const className = item.className || getClassName(item);

      update(store => {
        if (style) {
          // overwriting style for rule because user will be editing it
          store[item.id] = {
            ...store[item.id],
            [target]: style
          }
        } else if (store[item.id] && store[item.id][target]) {
          // if style is empty
          if (Object.keys(store[item.id]).length === 1) {
            delete store[item.id];
          } else {
            delete store[item.id][target];
          }
        }

        // send event to user site
        UserSiteEventsStore.set({
          event: UPDATE_STYLE as keyof typeof ENUMS.USER_SITE_EVENTS,
          data: {
            id: item.id,
            style: store[item.id][target],
            target,
          }
        });

        // refresh highlight
        HighlightStore.refresh();

        return store
      })

    },
    get: (id: string, target: any) => {
      const styles = get(store);

      if (styles[id] && styles[id][target.media]) {
        return styles[id][target.media]
      }

      return ''
    }
  }
})();