import { get, writable } from "svelte/store";
import type { Item } from "../../../global";
import { UserSiteEventsStore } from "./UserSiteEventsStore";
import { ENUMS } from "../enums";
import { SelectedItemStore } from "./SelectedItemStore";
import userSite from "../lib/userSite";
import { getId } from "../util/getId";
import storeData from "../lib/storeData";

const { CHANGE_LOCATION } = ENUMS.USER_SITE_EVENTS;
const { EMPTY_SITE_COMPONENT } = ENUMS.CSS_CLASS;

export const ItemsStore = (() => {
  const localKey = "items-store";
  const localHiddenChildrenKey = "hidden-children";
  const { subscribe, update, set } = writable([] as Item[]);
  let hiddenChildren = {} as { [parendId: string]: Item[] };

  const getParentIndex = (items, parentId) =>
    items.findIndex((item) => item.id === parentId);

  const showChildren = (items, parentId, parentIndex) =>
    new Promise((res) => {
      const parentHiddenChildren = hiddenChildren[parentId];

      if (parentHiddenChildren) {
        const children = parentHiddenChildren;
        items.splice(parentIndex + 1, 0, ...children);
      }
      res(true);
    });

  const add = async (item = {} as any, parent?: Item) =>
    new Promise(async (res) => {
      const newItem = {
        depth: item.depth || 1,
        id: item.defaultId || item.id || getId(),
        tag: item.tag || "div",
        label: item.label || "Div",
        attributes: item.attributes || {},
        isComponent: item.isComponent || false,
        parentId: item.parentId || null,
        hasChildren: item.hasChildren || false,
        showingChildren: true,
        node: null,
      } as Item;

      if (item.className) {
        newItem.className = item.className;
      }

      update((items) => {
        if (parent || newItem.parentId) {
          // insert after last child
          const parentIndex = getParentIndex(
            items,
            parent?.id || newItem.parentId
          );
          const currentParent = parent || items[parentIndex];

          if (parent) {
            showChildren(items, currentParent.id, parentIndex);
          }

          let lastChildIndex = parentIndex;

          while (
            items[lastChildIndex + 1] &&
            items[lastChildIndex + 1].depth > currentParent.depth
          ) {
            lastChildIndex = lastChildIndex + 1;
          }

          items[parentIndex].hasChildren = true;
          items[parentIndex].showingChildren = true;

          newItem.depth = currentParent.depth + 1;
          newItem.parentId = currentParent.id;
          items.splice(lastChildIndex + 1, 0, newItem);
          return items;
        } else {
          newItem.parentId = null;
          return [...items, newItem];
        }
      });

      await userSite().addToParent(newItem);

      res(true);
    });

  return {
    subscribe,
    add,
    refresh: () => update((a) => a),
    hideChildren: (parent: Item) => {
      const newHiddenChildren = [];

      update((items) => {
        const parentIndex = getParentIndex(items, parent.id);
        const childIndex = parentIndex + 1;

        while (items[childIndex] && items[childIndex].depth > parent.depth) {
          const removedChildren = items.splice(childIndex, 1);
          newHiddenChildren.push(...removedChildren);
        }

        items[parentIndex].showingChildren = false;

        return items;
      });
      hiddenChildren[parent.id] = newHiddenChildren;
      storeData.saveOnLocal(localHiddenChildrenKey, hiddenChildren);
    },
    showChildren: (parent: Item) => {
      update((items) => {
        const parentIndex = getParentIndex(items, parent.id);

        showChildren(items, parent.id, parentIndex);

        items[parentIndex].showingChildren = true;
        return items;
      });
      delete hiddenChildren[parent.id];
      storeData.saveOnLocal(localHiddenChildrenKey, hiddenChildren);
    },
    insertInPosition: (item, prevIndex, newIndex) => {
      update((items) => {
        const dir = prevIndex < newIndex ? 0 : -1;
        const leftSibling = items[newIndex + dir];

        const prevItem = items.splice(prevIndex, 1);

        // check if parent still has children
        const oldParentIndex = getParentIndex(items, prevItem[0].parentId);
        const oldParent = items[oldParentIndex];
        if (
          !items[oldParentIndex + 1] ||
          items[oldParentIndex + 1].depth <= oldParent.depth
        ) {
          // it doesn't have children
          oldParent.hasChildren = false;
          oldParent.showingChildren = false;
          oldParent.node.classList.add(EMPTY_SITE_COMPONENT);
        }

        // update children depth
        if (hiddenChildren[item.id]) {
          hiddenChildren[item.id].forEach((el) => {
            const diff = el.depth - prevItem[0].depth;
            el.depth = item.depth + diff;
          });
        }

        const leftSiblingIndex = items.findIndex(
          (el) => el.id === leftSibling.id
        );

        items.splice(leftSiblingIndex + 1, 0, item);

        // send event to user site
        UserSiteEventsStore.set({
          event: CHANGE_LOCATION as keyof typeof ENUMS.USER_SITE_EVENTS,
          data: { item, leftSibling },
        });

        return items;
      });
    },
    delete: (item) => {
      if (item.id === "body") return;

      let deletedItems = [];

      update((items) => {
        SelectedItemStore.set({});
        let deleteIds = [item.id];

        const findChildrenIds = (children) => {
          for (let i = 0; i < children.length; i++) {
            const childNode = children[i];
            deleteIds.push(childNode.dataset.id);
            if (childNode.children) findChildrenIds(childNode.children);
          }
        };
        findChildrenIds(item.node.children);

        deleteIds.forEach((id) => {
          if (hiddenChildren[id]) {
            delete hiddenChildren[id];
          }
        });

        userSite().deleteItem(item);

        deletedItems = items.filter((el) => deleteIds.includes(el.id));

        return items.filter((el) => !deleteIds.includes(el.id));
      });

      return deletedItems;
    },
    clear: () => {
      hiddenChildren = {};
      storeData.saveOnLocal(localHiddenChildrenKey, hiddenChildren);
      update(() => []);
    },
    cleanup: () => {
      hiddenChildren = {};
      set([]);
    },
    hydrate: async () =>
      new Promise(async (res) => {
        let hydrating = true;
        const unsubcsribe = subscribe(async (store) =>
          storeData.saveOnLocal(localKey, store, hydrating)
        );

        const localStore = storeData.getLocalStore(localKey) as Item[];

        if (localStore && localStore.length > 0) {
          const addQueue = localStore;
          const localHiddenChildren = storeData.getLocalStore(
            localHiddenChildrenKey
          );

          if (
            localHiddenChildren &&
            Object.keys(localHiddenChildren).length > 0
          ) {
            for (const key in localHiddenChildren) {
              const children = localHiddenChildren[key];
              addQueue.push(...children);
            }
          }

          for (let i = 0; i < addQueue.length; i) {
            const item = addQueue[i];
            const store = get(ItemsStore);
            const parentIndex = getParentIndex(store, item.parentId);
            const isAlreadyOnStore = store.find(
              (storeItem) => storeItem.id === item.id
            );
            if (
              item.id === "body" ||
              (parentIndex !== -1 && !isAlreadyOnStore)
            ) {
              const parent = store[parentIndex];
              await add(item, parent);
            } else if (!isAlreadyOnStore) {
              addQueue.push(item);
            }

            addQueue.shift();
          }

          storeData.saveOnLocal(localHiddenChildrenKey, {});
        } else {
          await add({ defaultId: "body", label: "Body" });
        }

        hydrating = false;
        res(unsubcsribe);
      }),
    updateLocalItem: (item: Item) => {
      const store = get(ItemsStore);
      const newLocalStore = store.map((storeItem) =>
        storeItem.id === item.id ? item : storeItem
      );
      storeData.saveOnLocal(localKey, newLocalStore);
    },
  };
})();
