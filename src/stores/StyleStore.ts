import { get, writable } from "svelte/store";
import type { Item, StyleStoreItem } from "../global";
import { ENUMS } from "../enums";
import { HighlightStore } from "./HighlightStore";
import { UserSiteEventsStore } from "./UserSiteEventsStore";
import storeData from "../lib/storeData";
import { ItemsStore } from "./ItemsStore";
import userSite from "../lib/userSite";

const { UPDATE_STYLE } = ENUMS.USER_SITE_EVENTS;

export const StyleStore = (() => {
  const localKey = "style-store";
  const localClassNameToIdKey = "style-id-to-class";
  const store = writable({} as StyleStoreItem);
  const { subscribe, update } = store;
  let classNameToId = {};
  let classNamesCount = 0;

  const getClassName = (item: Item) => {
    classNamesCount++;
    item.className = `element-${classNamesCount}`;
    return item.className;
  };

  const add = (item: Item | null, style: string, target: string) => {
    if (!item || Object.keys(item).length === 0) return;

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

    classNameToId[className] = item.id;
    storeData.saveOnLocal(localClassNameToIdKey, classNameToId);
  };

  return {
    subscribe,
    add,
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
    clear: () => {
      classNameToId = {};
      classNamesCount = 0;
      storeData.saveOnLocal(localClassNameToIdKey, {});
      update(() => ({}));
    },
    hydrate: () => {
      let hydrating = true;

      subscribe((store) => storeData.saveOnLocal(localKey, store, hydrating));

      const localStore = storeData.getLocalStore(localKey) as Item[];
      const storeLength = localStore && Object.keys(localStore).length;

      if (storeLength && storeLength > 0) {
        classNamesCount = storeLength;

        const localClassNameToId = storeData.getLocalStore(
          localClassNameToIdKey
        );
        const itemsStore = get(ItemsStore);

        for (const className in localStore) {
          const id = localClassNameToId[className];
          const item = itemsStore.find((item) => item.id === id);

          if (item) {
            for (const target in localStore[className]) {
              add(item, localStore[className][target], target);
            }
          }
        }

        classNameToId = localClassNameToId;
      }

      hydrating = false;
    },
    remove: (item: Item) => {
      if (!item || !item.className) return;

      update((store) => {
        userSite.deleteItemCssRules(item.className);
        delete store[item.className];
        return store;
      });
    },
  };
})();
