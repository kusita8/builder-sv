import { ENUMS } from "../enums";
import type { Item } from "../global";
import { HighlightStore } from "../stores/HighlightStore";
import { SelectedItemStore } from "../stores/SelectedItemStore";
import { UserSiteEventsStore } from "../stores/UserSiteEventsStore";
import { createNode } from "../util/createNode";
import { getClass } from "../util/getClass";
import { onLoad } from "../util/onLoad";
import { s } from "../util/s";

const { DATA_ID } = ENUMS;
const {
  ADD_TO_PARENT,
  CHANGE_LOCATION,
  UPDATE_STYLE,
  SET_ATTRIBUTE,
  CHANGE_NODE_TAG
} = ENUMS.USER_SITE_EVENTS
const { EMPTY_SITE_COMPONENT } = ENUMS.CSS_CLASS

class UserSite {
  body: HTMLBodyElement;
  sheet: CSSStyleSheet;
  isMutating = false;
  currentMutationNode = null;
  mutationBacklog = [];

  constructor() {
    onLoad(() => {
      const iframe = s('#user-site') as HTMLIFrameElement
      this.body = iframe.contentWindow.document.body as HTMLBodyElement;

      const style = document.createElement("style");
      style.id = 'mainstyles';
      iframe.contentWindow.document.head.appendChild(style);
      this.sheet = style.sheet as CSSStyleSheet;

      UserSiteEventsStore.subscribe(value => {
        const { event, data } = value;

        switch (event) {
          case ADD_TO_PARENT:
            return this.addToParent(data)
          case CHANGE_LOCATION:
            return this.changeLocation(data)
          case UPDATE_STYLE:
            return this.updateStyle(data)
          case SET_ATTRIBUTE:
            return this.setAttribute(data)
          case CHANGE_NODE_TAG:
            return this.changeNodeTag(data)
          default:
            return null;
        }
      });

      const observer = new MutationObserver(() => {
        if (this.body.contains(this.currentMutationNode)) {
          this.isMutating = false;
          this.currentMutationNode = null;
          if (this.mutationBacklog.length > 0) {
            this.mutationBacklog.shift()();
          }
        }
      })

      observer.observe(this.body, { attributes: true, childList: true, subtree: true })
    })
  }

  private _generateNode(item, isEmpty = true) {
    const className = getClass(
      isEmpty && EMPTY_SITE_COMPONENT,
      item.className
    )

    const node = createNode({
      [DATA_ID]: item.id,
      tag: item.tag,
      class: className,
      ...item.attributes
    });

    item.node = node;

    node.addEventListener('click', e => {
      e.stopPropagation();
      e.preventDefault();
      SelectedItemStore.set(item);
    });

    node.addEventListener('dblclick', e => {
      e.stopPropagation();
      e.preventDefault();
      SelectedItemStore.setInput(item);
    });

    return node;
  }

  private _generateCssRule(className, style, target) {
    const rule = `.${className}{${style}}`;
    if (target === 'ALL') {
      return rule
    } else {
      return `@media ${target}{${rule}}`
    }
  }

  private _getIframeHTML(iframeDocument) {
    let html = '<!DOCTYPE html><html lang="en">';
    html += `<head>${iframeDocument.head.innerHTML}</head>`;
    html += `<body>${iframeDocument.body.innerHTML}</body>`;
    return html
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

    HighlightStore.refresh();
  }

  updateStyle({ className, style, target }) {
    const cssRules = this.sheet.cssRules;

    this.deleteItemCssRules(className, target);

    // ADD NEW RULE
    if (style) {
      this.sheet.insertRule(this._generateCssRule(className, style, target), cssRules.length);
    }
  }

  deleteItemCssRules(className: string, target?: string) {
    const currentClass = `.${className}`;
    const cssRules = this.sheet.cssRules;

    const checkRules = (cssRules, deleteRule) => {
      for (let i = 0; i < cssRules.length; i++) {
        const rule = cssRules[i];

        if (rule.selectorText === currentClass) {
          if (deleteRule) {
            this.sheet.deleteRule(i)
          }
          return true;
        }
      }
    };

    const checkMediaRules = () => {
      for (let i = 0; i < cssRules.length; i++) {
        const rule = cssRules[i] as any;

        if (rule.conditionText === target && checkRules(rule.cssRules, false)) {
          this.sheet.deleteRule(i);
          break;
        }
      }
    }

    if (!target) {
      // delete all rules
      checkRules(cssRules, true);
      checkMediaRules();
    } else if (target === 'ALL') {
      checkRules(cssRules, true)
    } else {
      checkMediaRules();
    }
  }

  deleteItem(item) {
    if (item.className) this.deleteItemCssRules(item.className);
    const parent = item.node.parentNode;
    parent.removeChild(item.node);

    if (!parent.firstChild) {
      parent.classList.add(EMPTY_SITE_COMPONENT);
    }
  }

  setAttribute({ node, attribute }: { node: HTMLElement, attribute: any }) {
    node.setAttribute(attribute.name, attribute.value);
  }

  changeNodeTag(item: Item) {
    if (this.isMutating) {
      this.mutationBacklog.push(() => this.changeNodeTag(item));
      return;
    }

    this.isMutating = true;

    const oldNode = item.node;
    const children = [...oldNode.children];

    const newUserNode = this._generateNode(item, children.length === 0);

    this.currentMutationNode = newUserNode;

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      newUserNode.appendChild(child);
    }

    if (item.tag === 'img') this.removeDefaultItemClass(item);

    oldNode.parentElement.replaceChild(newUserNode, oldNode)
    item.node = newUserNode;
  }

  removeDefaultItemClass(item: Item) {
    if (item.node.classList.contains(EMPTY_SITE_COMPONENT)) {
      item.node.classList.remove(EMPTY_SITE_COMPONENT);
      HighlightStore.refresh();
    }
  }

  addDefaultItemClass(item: Item) {
    if (!item.node.classList.contains(EMPTY_SITE_COMPONENT)) {
      item.node.classList.add(EMPTY_SITE_COMPONENT);
      HighlightStore.refresh();
    }
  }

  updateItemInnerText(item: Item, value: string) {
    const hasTextNode = item.node.childNodes[0] && item.node.childNodes[0].nodeValue;

    if (value.length === 0 && hasTextNode) {
      item.node.removeChild(item.node.childNodes[0]);
      if (!item.hasChildren) this.addDefaultItemClass(item);
      else HighlightStore.refresh();
    } else {
      if (hasTextNode) {
        // already had node
        item.node.childNodes[0].nodeValue = value;
      } else {
        const textNode = document.createTextNode(value);
        item.node.insertBefore(textNode, item.node.firstChild);
        if (!item.hasChildren) this.removeDefaultItemClass(item);
        else HighlightStore.refresh();
      }
    }
  }

  generateHTML() {
    const iframeDocument = s('#user-site').contentWindow.document;

    const iframeCopy = document.createElement("iframe");
    document.body.appendChild(iframeCopy);

    const iframeCopyDocument = iframeCopy.contentWindow.document;
    iframeCopyDocument.head.innerHTML = iframeDocument.head.innerHTML;
    iframeCopyDocument.body.innerHTML = iframeDocument.body.innerHTML;

    const styles = Object.values(this.sheet.cssRules).reduce((acc, cur) => acc += cur.cssText, '');
    const iframeCopyStyleTag = iframeCopyDocument.querySelector('#mainstyles');
    iframeCopyStyleTag.innerHTML = styles;
    iframeCopyStyleTag.removeAttribute('id');

    // remove data id and empty class
    iframeCopyDocument.body.querySelectorAll('[data-id]').forEach(node => {
      node.removeAttribute('data-id');
      node.classList.remove(EMPTY_SITE_COMPONENT)
      if (!node.className) {
        node.removeAttribute('class');
      }
    })

    const html = this._getIframeHTML(iframeCopyDocument);
    document.body.removeChild(iframeCopy)
    return html
  }
}


export default new UserSite();