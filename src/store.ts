import { writable } from 'svelte/store';
import { ENUMS } from './enums';
import type { Item, StyleStoreItem, UserSiteEvent } from './global';
import { getId } from './utils';

const { ADD_TO_PARENT, CHANGE_LOCATION, UPDATE_STYLE } = ENUMS.USER_SITE_EVENTS
const { EMPTY_SITE_COMPONENT } = ENUMS.CSS_CLASS

export const ItemsStore = (() => {
  const { subscribe, update } = writable([] as Item[])
  const hiddenChildren = {} as { parent: Item, children: Item[] };

  const getParentIndex = (items, parent) => items.findIndex(item => item.id === parent.id);

  const showChildren = (items, parent, parentIndex) => {
    const parentHiddenChildren = hiddenChildren[parent.id];

    if (parentHiddenChildren) {
      const children = parentHiddenChildren.children;
      items.splice(parentIndex + 1, 0, ...children)
    }
  };

  return {
    subscribe,
    refresh: () => update(a => a),
    add: (parent?: Item, item = {} as any) => {

      const newItem = {
        depth: 1,
        id: getId(),
        tag: 'div',
        label: item.label || 'Div',
        node: null,
        parentId: null,
        hasChildren: false,
        showingChildren: true
      }

      update((items) => {
        if (parent) {
          // insert after last child
          const parentIndex = getParentIndex(items, parent);

          showChildren(items, parent, parentIndex);

          let lastChildIndex = parentIndex;

          while (items[lastChildIndex + 1] && items[lastChildIndex + 1].depth > parent.depth) {
            lastChildIndex = lastChildIndex + 1;
          }

          items[parentIndex].hasChildren = true;
          items[parentIndex].showingChildren = true;
          newItem.depth = parent.depth + 1;
          newItem.parentId = parent.id;
          items.splice(lastChildIndex + 1, 0, newItem);
          return items;
        } else {
          newItem.parentId = null;
          return [...items, newItem]
        }
      })

      // send event to user site
      userSiteEvents.set({
        event: ADD_TO_PARENT as keyof typeof ENUMS.USER_SITE_EVENTS,
        data: newItem
      })
    },
    hideChildren: (parent: Item) => {
      const newHiddenChildren = { parent, children: [] }

      update(items => {
        const parentIndex = getParentIndex(items, parent);
        const childIndex = parentIndex + 1;

        while (items[childIndex] && items[childIndex].depth > parent.depth) {
          const removedChildren = items.splice(childIndex, 1);
          newHiddenChildren.children.push(...removedChildren);
        }

        items[parentIndex].showingChildren = false;

        return items;
      })

      hiddenChildren[parent.id] = newHiddenChildren;
    },
    showChildren: (parent: Item) => {
      update(items => {
        const parentIndex = getParentIndex(items, parent);

        showChildren(items, parent, parentIndex);

        items[parentIndex].showingChildren = true;
        return items;
      })

      delete hiddenChildren[parent.id];
    },
    insertInPosition: (item, prevIndex, newIndex) => {

      if (prevIndex === newIndex) return;

      update(items => {
        const dir = prevIndex > newIndex ? -1 : 0;
        const leftSibling = items[newIndex + dir];

        const prevItem = items.splice(prevIndex, 1);

        // check if parent still has children
        const oldParentIndex = getParentIndex(items, { id: prevItem[0].parentId });
        const oldParent = items[oldParentIndex];
        if (!items[oldParentIndex + 1] ||
          items[oldParentIndex + 1].depth <= oldParent.depth) {
          // it doesn't have children
          oldParent.hasChildren = false;
          oldParent.showingChildren = false;
          oldParent.node.classList.add(EMPTY_SITE_COMPONENT)
        }

        // update children depth
        if (hiddenChildren[item.id]) {
          hiddenChildren[item.id].children.forEach(el => {
            const diff = el.depth - prevItem[0].depth;
            el.depth = item.depth + diff;
          })
        }

        const leftSiblingIndex = items.findIndex(el => el.id === leftSibling.id);

        items.splice(leftSiblingIndex + 1, 0, item);

        // send event to user site
        userSiteEvents.set({
          event: CHANGE_LOCATION as keyof typeof ENUMS.USER_SITE_EVENTS,
          data: { item, leftSibling }
        })

        return items;
      })
    },
  }
})();

export const userSiteEvents = writable({} as UserSiteEvent);

export const selectedItem = (() => {
  const { subscribe, update, set } = writable({} as Item | {});

  return {
    subscribe,
    update,
    set,
    setValue: (key: keyof Item, val: any) => {
      update(item => {
        if (Object.keys(item).length > 0) {
          item[key] = val;

          // refresh items store
          ItemsStore.refresh();
        }

        return item
      })
    }
  }
})()

export const styleStore = (() => {
  const { subscribe, update } = writable({} as StyleStoreItem);

  return {
    subscribe,
    add: (item: Item | null, style: string) => {

      if (Object.keys(item).length === 0) return;

      // TODO: this should come as parameter
      const target = 'ALL';

      update(store => {
        // overwriting style for rule because user will be editing it
        store[item.id] = {
          ...store[item.id],
          [target]: style
        }

        // send event to user site
        userSiteEvents.set({
          event: UPDATE_STYLE as keyof typeof ENUMS.USER_SITE_EVENTS,
          data: {
            id: item.id,
            style: store[item.id][target],
            target,
          }
        })

        return store
      })

    }
  }
})()

