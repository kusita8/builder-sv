import { get, writable } from "svelte/store";
import type { Item, StyleStoreItem } from "../global";
import { ENUMS } from "../enums";
import { HighlightStore } from "./HighlightStore";
import { UserSiteEventsStore } from "./UserSiteEventsStore";

const { UPDATE_STYLE } = ENUMS.USER_SITE_EVENTS;

export const StyleStore = (() => {
  const store = writable({} as StyleStoreItem);
  const { subscribe, update } = store;
  let classNamesCount = 0;

  const getClassName = (item: Item) => {
    classNamesCount++;
    item.className = `element-${classNamesCount}`;
    return item.className;
  };

  return {
    subscribe,
    add: (item: Item | null, style: string, target: string) => {
      if (Object.keys(item).length === 0) return;

      const className = item.className || getClassName(item);

      if (style) {
        item.node.classList.add(className);
      }

      update((store) => {
        if (style) {
          // overwriting style for rule because user will be editing it
          store[className] = {
            ...store[className],
            [target]: style,
          };
        } else if (store[className] && store[className][target]) {
          // if style is empty
          if (Object.keys(store[className]).length === 1) {
            item.node.classList.remove(className);
            delete store[className];
          } else {
            delete store[className][target];
          }
        }

        // send event to user site
        UserSiteEventsStore.set({
          event: UPDATE_STYLE as keyof typeof ENUMS.USER_SITE_EVENTS,
          data: {
            className,
            style: store[className] && store[className][target],
            target,
          },
        });

        // refresh highlight
        HighlightStore.refresh();

        return store;
      });
    },
    get: (className: string, media: any) => {
      const styles = get(store);

      if (styles[className] && styles[className][media]) {
        return styles[className][media];
      }

      return "";
    },
    addClassName: (item: Item) => {
      const className = getClassName(item);
      item.node.classList.add(className);
    },
  };
})();
