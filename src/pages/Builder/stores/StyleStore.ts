import { get, writable } from "svelte/store";
import type { Item, StyleStoreItem } from "../../../global";
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
  const { subscribe, update, set } = store;
  let classNameToId = {};
  let classNamesCount = 0;

  const getClassName = (item: Item) => {
    classNamesCount++;
    item.className = `element-${classNamesCount}`;
    return item.className;
  };

  const add = async (item: Item | null, style: string, target: string) =>
    new Promise((res) => {
      if (!item || Object.keys(item).length === 0) return;

      let className = item.className;

      if (!className) {
        className = getClassName(item);
        item.className = className;
      }

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
            item,
          },
        });

        // refresh highlight
        HighlightStore.refresh();

        return store;
      });

      ItemsStore.updateLocalItem(item);
      classNameToId[className] = item.id;
      storeData.saveOnLocal(localClassNameToIdKey, classNameToId);

      requestAnimationFrame(() => {
        res(true);
      });
    });

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
    cleanup: () => {
      classNameToId = {};
      classNamesCount = 0;
      set({});
    },
    hydrate: async () =>
      new Promise(async (res) => {
        let hydrating = true;

        const unsubscribe = subscribe((store) =>
          storeData.saveOnLocal(localKey, store, hydrating)
        );

        const localStore = storeData.getLocalStore(localKey) as Item[];
        const storeLength = localStore && Object.keys(localStore).length;

        if (storeLength && storeLength > 0) {
          const localClassNameToId = storeData.getLocalStore(
            localClassNameToIdKey
          );
          const itemsStore = get(ItemsStore);

          for (const className in localStore) {
            const id = localClassNameToId[className];
            const item = itemsStore.find((item) => item.id === id);

            if (item) {
              for (const target in localStore[className]) {
                await add(item, localStore[className][target], target);
              }

              const classNameNumber = Number(className.split("-")[1]);

              if (classNameNumber >= classNamesCount) {
                classNamesCount = classNameNumber;
              }
            }
          }

          classNameToId = localClassNameToId;
        }

        hydrating = false;
        res(unsubscribe);
      }),
    remove: (item: Item | Item[]) => {
      const isArray = Array.isArray(item);
      if (!isArray && (!item || !item.className)) return;

      // DELTE ALSO CHILD STYLES
      update((store) => {
        if (isArray) {
          item.forEach((deletedItem: Item) => {
            delete store[deletedItem.className];
          });
        } else {
          userSite().deleteItemCssRules(item.className);
          delete store[item.className];
        }

        return store;
      });
    },
  };
})();
