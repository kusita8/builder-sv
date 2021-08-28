import { get, writable } from "svelte/store";
import type { Attribute, Item } from "../global";
import { ENUMS } from '../enums';
import selectedItemInput from "../lib/selectedItemInput";
import { ItemsStore } from './ItemsStore'
import { HighlightStore } from './HighlightStore'
import { UserSiteEventsStore } from './UserSiteEventsStore'
import { StyleStore } from "./StyleStore";

const {
  SET_ATTRIBUTE,
  CHANGE_NODE_TAG
} = ENUMS.USER_SITE_EVENTS

export const SelectedItemStore = (() => {
  const store = writable({} as Item);
  const { subscribe, update, set } = store;

  const updateSelected = (cb) => {
    update(item => {
      if (Object.keys(item).length > 0) {
        return cb(item)
      } else {
        return item;
      }
    })
  }

  const updateComponents = (item, cb) => {
    get(ItemsStore).forEach(el => {
      if (el.id !== item.id && el.className === item.className) {
        cb(el);
      }
    })
  }

  return {
    subscribe,
    set: (item: Item | {}) => {
      if (get(store).id !== (item as Item).id) {
        set(item as Item);
        HighlightStore.set(item);
      }
    },
    setInput: (item?: Item) => {
      selectedItemInput.set(item || get(store));
    },
    setValue: (key: keyof Item, val: any) => {
      update(item => {
        const mutations = item => {
          item[key] = val;
        }
        mutations(item);

        if (key === 'label' && item.isComponent) updateComponents(item, mutations)

        // refresh items store
        ItemsStore.refresh();

        // refresh highlight
        HighlightStore.set(item)

        return item
      })
    },
    setAttribute: (name: string, value: string) => {
      updateSelected((item: Item) => {
        (item.attributes as Attribute)[name] = value;

        // send to user site
        UserSiteEventsStore.set({
          event: SET_ATTRIBUTE as keyof typeof ENUMS.USER_SITE_EVENTS,
          data: { node: item.node, attribute: { name, value } }
        })

        return item
      })
    },
    setTag: (newTag) => {
      updateSelected((item: Item) => {
        const mutations = (item) => {
          item.tag = newTag;

          // send to user site
          UserSiteEventsStore.set({
            event: CHANGE_NODE_TAG as keyof typeof ENUMS.USER_SITE_EVENTS,
            data: item
          })
        }
        mutations(item);

        if (item.isComponent) updateComponents(item, mutations)

        return item;
      })
    },
    setAsComponent: () => {
      update(item => {
        item.isComponent = true

        if (!item.className) {
          StyleStore.addClassName(item);
        }

        return item;
      })
    },

  }
})();
