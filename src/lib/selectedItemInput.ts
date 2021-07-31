import type { Item } from "../global";
import { onLoad, s } from "../utils";
import userSite from "./userSite";


class SelectedItemInput {
  input: HTMLInputElement;
  selectedItem = false as Item | boolean;

  constructor() {
    onLoad(() => {
      const node = s('.selected-item-input');
      this.input = node;

      node.addEventListener('input', e => {
        const value = e.target.value;

        if (this.selectedItem) {
          userSite.updateItemInnerText(this.selectedItem as Item, value)
        }
      })
    })
  }

  set(item: Item) {
    if (Object.keys(item).length > 0) {
      this.selectedItem = item;
      this.input.value = item.node.childNodes[0] &&
        item.node.childNodes[0].nodeType === Node.TEXT_NODE ?
        item.node.childNodes[0].nodeValue : '';
      this.input.select();
      this.input.selectionStart = this.input.selectionEnd;
    } else {
      this.clear();
    }
  }

  clear() {
    this.selectedItem = false;
    this.input.value = '';
    this.input.blur();
  }

}


export default new SelectedItemInput();