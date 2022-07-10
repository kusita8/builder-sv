import { ENUMS } from "../enums";
import type { Item } from "../../../global";
import { HighlightStore } from "../stores/HighlightStore";
import { SelectedItemStore } from "../stores/SelectedItemStore";
import { UserSiteEventsStore } from "../stores/UserSiteEventsStore";
import { createNode } from "../util/createNode";
import { getClass } from "../util/getClass";
import { s } from "../util/s";

const { DATA_ID } = ENUMS;
const {
  ADD_TO_PARENT,
  CHANGE_LOCATION,
  UPDATE_STYLE,
  SET_ATTRIBUTE,
  CHANGE_NODE_TAG,
  REMOVE_ATTRIBUTE,
} = ENUMS.USER_SITE_EVENTS;
const { EMPTY_SITE_COMPONENT } = ENUMS.CSS_CLASS;
const FONT_STYLE_ID = "fontstyle";
const MAIN_STYLE_ID = "mainstyles";
let instance;

class UserSite {
  iframe: HTMLIFrameElement;
  body: HTMLBodyElement;
  sheet: CSSStyleSheet;
  fontSheet: CSSStyleSheet;
  isMutating = false;
  currentMutationNode = null;
  mutationBacklog = [];
  importRules = {};
  cleanup = () => (instance = undefined);

  constructor() {
    const iframe = s("#user-site") as HTMLIFrameElement;

    this.iframe = iframe;
    this.body = iframe.contentWindow.document.body as HTMLBodyElement;
    this.fontSheet = this._generateStyleTag(iframe, FONT_STYLE_ID);
    this.sheet = this._generateStyleTag(iframe, MAIN_STYLE_ID);

    UserSiteEventsStore.subscribe((value) => {
      const { event, data } = value;

      switch (event) {
        case ADD_TO_PARENT:
          return this.addToParent(data);
        case CHANGE_LOCATION:
          return this.changeLocation(data);
        case UPDATE_STYLE:
          return this.updateStyle(data);
        case SET_ATTRIBUTE:
          return this.setAttribute(data);
        case REMOVE_ATTRIBUTE:
          return this.removeAttribute(data);
        case CHANGE_NODE_TAG:
          return this.changeNodeTag(data);
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
    });

    observer.observe(this.body, {
      attributes: true,
      childList: true,
      subtree: true,
    });
  }

  private _generateStyleTag(iframe: HTMLIFrameElement, id: string) {
    const fontStyle = document.createElement("style");
    fontStyle.id = id;
    iframe.contentWindow.document.head.appendChild(fontStyle);
    return fontStyle.sheet as CSSStyleSheet;
  }

  private _generateCssFromSheet(sheet: CSSStyleSheet) {
    return Object.values(sheet.cssRules).reduce(
      (acc, cur) => (acc += cur.cssText),
      ""
    );
  }

  private _generateNode(item, isEmpty = true) {
    const className = getClass(isEmpty && EMPTY_SITE_COMPONENT, item.className);

    const node = createNode({
      [DATA_ID]: item.id,
      tag: item.tag,
      class: className,
      ...item.attributes,
    });

    item.node = node;

    node.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      SelectedItemStore.set(item);
    });

    node.addEventListener("dblclick", (e) => {
      e.stopPropagation();
      e.preventDefault();
      SelectedItemStore.setInput(item);
    });

    return node;
  }

  private _generateCssRules(className, style, target: string, item: Item) {
    const urlStyleRegex = new RegExp(/^(\@).*?(([\)|;]))$/gms);
    const nestedStyleRegex = new RegExp(/^([^\n]*\{).*?(\})$/gms);
    const targetStyle = style
      .replace(nestedStyleRegex, "")
      .replace(urlStyleRegex, "");
    const urlsStyle = style.match(urlStyleRegex) || [];
    const nestedStyles = style.match(nestedStyleRegex);
    const getNestedRuleGap = (rule) => (rule.startsWith(":") ? "" : " ");
    const rule = `.${className}{${targetStyle}}`;
    let classNameRule = [];
    let nestedRules = [];

    if (targetStyle.includes("url")) {
      this.removeDefaultItemClass(item);
    } else if (
      !item.node.hasChildNodes() &&
      item.node.tagName !== "IMG" &&
      !(item.attributes as any).src
    ) {
      this.addDefaultItemClass(item);
    }

    if (!target || target.includes("ALL")) {
      if (targetStyle) classNameRule = [rule];
      if (nestedStyles)
        nestedRules = nestedStyles.map(
          (rule) => `.${className}${getNestedRuleGap(rule)}${rule}`
        );
    } else {
      if (targetStyle) classNameRule = [`@media ${target}{${rule}}`];
      if (nestedStyles)
        nestedRules = nestedStyles.map(
          (rule) =>
            `@media ${target} (.${className}${getNestedRuleGap(rule)}${rule})`
        );
    }

    return [...classNameRule, ...nestedRules, ...urlsStyle];
  }

  private _getIframeHTML(iframeDocument) {
    let html = '<!DOCTYPE html><html lang="en">';
    html += `<head>${iframeDocument.head.innerHTML}</head>`;
    html += `<body>${iframeDocument.body.innerHTML}</body>`;
    return html;
  }

  clear() {
    this.body.innerHTML = "";
    const head = this.iframe.contentWindow.document.head;
    [
      head.querySelector(`#${FONT_STYLE_ID}`),
      head.querySelector(`#${MAIN_STYLE_ID}`),
    ].forEach((node) => {
      node.remove();
    });

    this.fontSheet = this._generateStyleTag(this.iframe, FONT_STYLE_ID);
    this.sheet = this._generateStyleTag(this.iframe, MAIN_STYLE_ID);
    this.mutationBacklog = [];
    this.importRules = {};
  }

  addToParent(item: Item) {
    return new Promise((res) => {
      const node = this._generateNode(item);

      if (item.parentId) {
        const parent = this.body.querySelector(`[${DATA_ID}=${item.parentId}]`);
        parent.classList.remove(EMPTY_SITE_COMPONENT);
        parent.appendChild(node);
      } else {
        this.body.appendChild(node);
      }

      if (item.attributes && Object.values(item.attributes).length > 0) {
        for (const name in item.attributes) {
          this.setAttribute({
            node: item.node,
            attribute: {
              name,
              value: item.attributes[name],
            },
          });
        }
      }

      res(true);
    });
  }

  changeLocation({ item, leftSibling }: { item: Item; leftSibling: Item }) {
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

      if (
        leftSibling.node.parentElement.getAttribute(DATA_ID) === item.parentId
      ) {
        // same parent, insert before sibling
        const leftSiblingParent = leftSibling.node.parentElement;

        // has sibling, insert before that
        leftSiblingParent.insertBefore(item.node, leftSibling.node.nextSibling);
      } else {
        // doesnt have sibling, find top parent
        let trueSibling = leftSibling.node.parentElement;

        while (
          trueSibling.parentElement &&
          trueSibling.parentElement.getAttribute(DATA_ID) !== item.parentId
        ) {
          trueSibling = trueSibling.parentElement;
        }

        trueSibling.parentElement?.insertBefore(
          item.node,
          trueSibling.nextSibling
        );
      }
    }

    HighlightStore.refresh();
  }

  updateStyle({ className, style, target, item }) {
    this.deleteItemCssRules(className, target);

    // ADD NEW RULE
    if (style) {
      const rules = this._generateCssRules(className, style, target, item);

      rules.forEach((rule) => {
        try {
          if (rule.includes("@import")) {
            const lastPosition = this.fontSheet.cssRules.length;
            const index = this.fontSheet.insertRule(rule, lastPosition);

            const sheetRule = this.fontSheet.cssRules[index] as any;
            this.importRules = {
              ...this.importRules,
              [className]: [
                ...(this.importRules[className] || []),
                sheetRule.href,
              ],
            };
          } else {
            const lastPosition = this.sheet.cssRules.length;
            this.sheet.insertRule(rule, lastPosition);
          }
        } catch {}
      });
    }
  }

  deleteItemCssRules(className: string, target?: string) {
    const currentClass = `.${className}`;
    const cssRules = this.sheet.cssRules;

    const ruleTargetsClassname = (cssRule) => {
      for (let i = 0; i < cssRule.length; i++) {
        const rule = cssRule[i];

        if (rule.selectorText.includes(currentClass)) {
          return true;
        }
      }
    };

    const deleteClassnameRules = (cssRules) => {
      for (let i = 0; i < cssRules.length; i++) {
        const rule = this.sheet.cssRules[i] as any;

        if (rule.selectorText?.includes(currentClass)) {
          this.sheet.deleteRule(i--);
        }
      }

      if (this.importRules[className]) {
        for (let i = 0; i < this.fontSheet.cssRules.length; i++) {
          const rule = this.fontSheet.cssRules[i] as any;

          if (this.importRules[className].includes(rule.href)) {
            this.fontSheet.deleteRule(i--);
            this.importRules[className] = this.importRules[className].filter(
              (item) => item !== rule.href
            );
          }
        }
      }
    };

    const checkMediaRules = () => {
      for (let i = 0; i < cssRules.length; i++) {
        const rule = cssRules[i] as any;

        if (
          rule.conditionText === target &&
          rule.cssRules &&
          ruleTargetsClassname(rule.cssRules)
        ) {
          this.sheet.deleteRule(i);
          break;
        }
      }
    };

    if (!target) {
      // delete all rules
      deleteClassnameRules(cssRules);
      checkMediaRules();
    } else if (target.includes("ALL")) {
      deleteClassnameRules(cssRules);
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

  setAttribute({ node, attribute }: { node: HTMLElement; attribute: any }) {
    if (node.tagName === "IMG" && attribute.name === "src") {
      this.removeDefaultItemClass({ node } as Item);
    }
    node.setAttribute(attribute.name, attribute.value);
  }

  removeAttribute({ node, name }: { node: HTMLElement; name: string }) {
    if (node.tagName === "IMG" && name === "src")
      this.addDefaultItemClass({ node } as Item);
    node.removeAttribute(name);
  }

  changeNodeTag(item: Item) {
    if (this.isMutating) {
      this.mutationBacklog.push(() => this.changeNodeTag(item));
      return;
    }

    this.isMutating = true;

    const oldNode = item.node;
    const children = [...(oldNode.children as any)];

    const newUserNode = this._generateNode(item, children.length === 0);

    this.currentMutationNode = newUserNode;

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      newUserNode.appendChild(child);
    }

    if (item.tag === "img") this.removeDefaultItemClass(item);

    oldNode.parentElement.replaceChild(newUserNode, oldNode);
    item.node = newUserNode;

    if (oldNode.innerText) {
      this.updateItemInnerText(item, oldNode.innerText);
    }

    setTimeout(() => {
      HighlightStore.refresh();
    }, 50);
  }

  removeDefaultItemClass(item: Item) {
    if (item.node.classList.contains(EMPTY_SITE_COMPONENT)) {
      item.node.classList.remove(EMPTY_SITE_COMPONENT);
      setTimeout(() => {
        HighlightStore.refresh();
      }, 50);
    }
  }

  addDefaultItemClass(item: Item) {
    if (!item.node.classList.contains(EMPTY_SITE_COMPONENT)) {
      item.node.classList.add(EMPTY_SITE_COMPONENT);
      setTimeout(() => {
        HighlightStore.refresh();
      }, 50);
    }
  }

  updateItemInnerText(item: Item, value: string) {
    const hasTextNode =
      item.node.childNodes[0] && item.node.childNodes[0].nodeValue;

    if (value.length === 0 && hasTextNode) {
      item.node.removeChild(item.node.childNodes[0]);
      if (!item.hasChildren) this.addDefaultItemClass(item);
    } else {
      if (hasTextNode) {
        // already had node
        item.node.childNodes[0].nodeValue = value;
      } else {
        const textNode = document.createTextNode(value);
        item.node.insertBefore(textNode, item.node.firstChild);
        if (!item.hasChildren) this.removeDefaultItemClass(item);
      }
    }

    setTimeout(() => {
      HighlightStore.refresh();
    }, 50);
  }

  generateHTML() {
    const iframeDocument = s("#user-site").contentWindow.document;

    const iframeCopy = document.createElement("iframe");
    document.body.appendChild(iframeCopy);

    const iframeCopyDocument = iframeCopy.contentWindow.document;
    iframeCopyDocument.head.innerHTML = iframeDocument.head.innerHTML;
    iframeCopyDocument.body.innerHTML = iframeDocument.body.innerHTML;

    const insertStyleToIFrame = (id: string, style: string) => {
      const styleTag = iframeCopyDocument.querySelector(`#${id}`);
      if (style) {
        styleTag.innerHTML = style;
        styleTag.removeAttribute("id");
      } else {
        styleTag.remove();
      }
    };

    const fontStyles = this._generateCssFromSheet(this.fontSheet);
    insertStyleToIFrame("fontstyle", fontStyles);

    const styles = this._generateCssFromSheet(this.sheet);
    insertStyleToIFrame("mainstyles", styles);

    iframeCopyDocument.querySelector(
      "#base-style"
    ).innerHTML = `*{margin:0;padding:0;box-sizing:border-box;}`;

    // remove data id and empty class
    iframeCopyDocument.body.querySelectorAll("[data-id]").forEach((node) => {
      node.removeAttribute("data-id");
      node.classList.remove(EMPTY_SITE_COMPONENT);
      if (!node.className) {
        node.removeAttribute("class");
      }
    });

    const html = this._getIframeHTML(iframeCopyDocument);
    document.body.removeChild(iframeCopy);
    return html;
  }
}

export default () => {
  if (instance) return instance;
  instance = new UserSite();
  return instance;
};
