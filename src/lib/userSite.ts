import { ENUMS } from "../enums";
import type { Item } from "../global";
import { selectedItem, userSiteEvents } from "../store";
import { createNode, onLoad, s } from "../utils";

const { ADD_TO_PARENT, CHANGE_LOCATION } = ENUMS.USER_SITE_EVENTS
const { EMPTY_SITE_COMPONENT } = ENUMS.CSS_CLASS

class UserSite {
  body: HTMLElement;

  constructor() {
    onLoad(() => {
      this.body = (s('#user-site') as HTMLIFrameElement).contentWindow.document.body;

      userSiteEvents.subscribe(value => {
        const { event, data } = value;

        switch (event) {
          case ADD_TO_PARENT:
            return this.addToParent(data)
          case CHANGE_LOCATION:
            return this.changeLocation(data)
          default:
            return null;
        }
      });
    })
  }

  private _generateNode(item) {
    const node = createNode({
      tag: item.tag,
      'data-id': item.id,
      class: EMPTY_SITE_COMPONENT
    });

    item.node = node;

    node.addEventListener('click', e => {
      e.stopPropagation();
      selectedItem.set(item);
    });

    return node;
  }

  addToParent(item: Item) {
    const node = this._generateNode(item)

    if (item.parentId) {
      const parent = this.body.querySelector(`[data-id=${item.parentId}]`);
      parent.classList.remove(EMPTY_SITE_COMPONENT);
      parent.appendChild(node);
    } else {
      this.body.appendChild(node);
    }
  }

  changeLocation({ item, leftSibling }: { item: Item, leftSibling: Item }) {
    if (item.parentId === leftSibling.id) {
      // sibling is parent
      if (leftSibling.node.firstChild) {
        // add before first child
        leftSibling.node.insertBefore(item.node, leftSibling.node.firstChild);
      } else {
        // doesnt have children, add to parent
        leftSibling.node.appendChild(item.node);
      }
    } else {
      // sibling is sibling
      const leftSiblingParent = leftSibling.node.parentElement;

      if (leftSibling.node.nextSibling) {
        // has right sibling, insert before that
        leftSiblingParent.insertBefore(item.node, leftSibling.node.nextSibling);
      } else {
        // doesnt have right sibling, add at the end
        leftSiblingParent.appendChild(item.node)
      }
    }

    selectedItem.update(a => a)
  }
}


export default new UserSite();