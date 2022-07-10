import { get } from "svelte/store";
import type { Item } from "../../../global";
import { ItemsStore } from "../stores/ItemsStore";
import { s } from "../util/s";
import storeData from "./storeData";
import userSite from "./userSite";

const localKey = "item-inner-text";
let instance;

class SelectedItemInput {
  input: HTMLInputElement;
  selectedItem = false as Item | boolean;
  itemsText = {};
  cleanup;

  constructor() {
    const node = s(".selected-item-input");
    this.input = node;

    const inputChangeHandler = (e) => {
      const value = e.target.value;

      if (this.selectedItem) {
        const item = this.selectedItem as Item;
        userSite().updateItemInnerText(item, value);

        if (value) {
          this.itemsText[item.id] = value;
        } else {
          delete this.itemsText[item.id];
        }

        storeData.saveOnLocal(localKey, this.itemsText);
      }
    };

    node.addEventListener("input", inputChangeHandler);

    this.cleanup = () => {
      instance = null;
      node.removeEventListener("input", inputChangeHandler);
    };
  }

  set(item: Item) {
    if (Object.keys(item).length > 0) {
      this.selectedItem = item;
      this.input.value =
        item.node.childNodes[0] &&
        item.node.childNodes[0].nodeType === Node.TEXT_NODE
          ? item.node.childNodes[0].nodeValue
          : "";
      this.input.select();
      this.input.selectionStart = this.input.selectionEnd;
    } else {
      this.clear();
    }
  }

  clear() {
    this.selectedItem = false;
    this.input.value = "";
    this.input.blur();
  }

  hydrate() {
    const localStore = storeData.getLocalStore(localKey);

    if (localStore && Object.keys(localStore).length > 0) {
      const itemStore = get(ItemsStore);

      for (const id in localStore) {
        const value = localStore[id];
        if (value) {
          const item = itemStore.find((item) => item.id === id);
          if (item) {
            requestAnimationFrame(() => {
              userSite().updateItemInnerText(item, value);
            });
          }
        }
      }

      this.itemsText = localStore;
    }
  }

  remove(item: Item | Item[]) {
    if (Array.isArray(item)) {
      item.forEach((deletedItem) => {
        delete this.itemsText[deletedItem.id];
      });
    } else {
      delete this.itemsText[item.id];
    }

    setTimeout(() => {
      storeData.saveOnLocal(localKey, this.itemsText);
    }, 60);
  }
}

export default () => {
  if (instance) return instance;
  instance = new SelectedItemInput();
  return instance;
};
