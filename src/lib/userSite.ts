import { ENUMS } from "../enums";
import type { Item } from "../global";
import { selectedItem, userSiteEvents } from "../store";
import { createNode, onLoad, s } from "../utils";

const { DATA_ID } = ENUMS;
const { ADD_TO_PARENT, CHANGE_LOCATION, UPDATE_STYLE } = ENUMS.USER_SITE_EVENTS
const { EMPTY_SITE_COMPONENT } = ENUMS.CSS_CLASS

class UserSite {
  body: HTMLBodyElement;
  sheet: CSSStyleSheet;

  constructor() {
    onLoad(() => {
      const iframe = s('#user-site') as HTMLIFrameElement
      this.body = iframe.contentWindow.document.body as HTMLBodyElement;

      const style = document.createElement("style");
      iframe.contentWindow.document.head.appendChild(style);
      this.sheet = style.sheet as CSSStyleSheet;

      userSiteEvents.subscribe(value => {
        const { event, data } = value;

        switch (event) {
          case ADD_TO_PARENT:
            return this.addToParent(data)
          case CHANGE_LOCATION:
            return this.changeLocation(data)
          case UPDATE_STYLE:
            return this.updateStyle(data)
          default:
            return null;
        }
      });
    })
  }

  private _generateNode(item) {
    const node = createNode({
      [DATA_ID]: item.id,
      tag: item.tag,
      class: EMPTY_SITE_COMPONENT
    });

    item.node = node;

    node.addEventListener('click', e => {
      e.stopPropagation();
      selectedItem.set(item);
    });

    return node;
  }

  private _generateCssRule(id, style, target) {
    const rule = `.${id}{${style}}`;
    if (target === 'ALL') {
      return rule
    } else {
      return `@media ${target}{${rule}}`
    }
  }

  addToParent(item: Item) {
    const node = this._generateNode(item)

    if (item.parentId) {
      const parent = this.body.querySelector(`[${DATA_ID}=${item.parentId}]`);
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

      if (leftSibling.node.parentElement.getAttribute(DATA_ID) === item.parentId) {
        // same parent, insert before sibling
        const leftSiblingParent = leftSibling.node.parentElement;

        // has sibling, insert before that
        leftSiblingParent.insertBefore(item.node, leftSibling.node.nextSibling);
      } else {
        // doesnt have sibling, find top parent
        let trueSibling = leftSibling.node.parentElement;

        while (trueSibling.parentElement.getAttribute(DATA_ID) !== item.parentId) {
          trueSibling = trueSibling.parentElement;
        }

        trueSibling.parentElement.insertBefore(item.node, trueSibling.nextSibling);

      }
    }

    selectedItem.update(a => a)
  }

  updateStyle({ id, style, target }) {
    const cssRules = this.sheet.cssRules;
    const className = `.${id}`;

    const checkRules = (cssRules, deleteRule) => {
      for (let i = 0; i < cssRules.length; i++) {
        const rule = cssRules[i];

        if (rule.selectorText === className) {
          if (deleteRule) {
            this.sheet.deleteRule(i)
          }
          return true;
        }
      }
    };

    // DELETE PREVIOUS RULE
    if (target === 'ALL') {
      checkRules(cssRules, true)
    } else {
      for (let i = 0; i < cssRules.length; i++) {
        const rule = cssRules[i] as any;

        if (rule.conditionText === target && checkRules(rule.cssRules, false)) {
          this.sheet.deleteRule(i);
          break;
        }
      }
    }

    // ADD NEW RULE
    this.sheet.insertRule(this._generateCssRule(id, style, target), cssRules.length);

  }
}


export default new UserSite();