import { get } from 'svelte/store';
import { ENUMS } from '../enums';
import type { Item } from '../global';
import { ItemsStore } from '../stores/ItemsStore';
import { SelectedItemStore } from '../stores/SelectedItemStore';
import { s } from '../utils';

const { DATA_ID } = ENUMS;

let items = [];
let height = 0;
let halfHeight = 0;
let nodesChanged = [];
let holding = 0;
let newDepth;
let grabbing = false;
let newParentId = null;

const HandleMouseUp = () => {
  holding -= 1
}

const cleanNodesAffected = (index) => {
  const newNodesChanged = nodesChanged;

  for (let i = nodesChanged.length - 1; i >= index; i--) {
    const el = nodesChanged[i];

    if (el) {
      el.style.transform = '';
      newNodesChanged.splice(i, 1);
    }
  }

  nodesChanged = newNodesChanged;
}

const grabItem = (node) => {
  document.body.style.cursor = "grabbing"
  node.classList.add('grab')
}

const ungrabItem = (node) => {
  document.body.style.cursor = "auto"
  node.classList.remove('grab')
}

const handleDepth = (node, dir) => {
  if (node) {
    // si tiene el icono, tiene children
    const passingNodeId = node.getAttribute(DATA_ID);
    const passingItem = items.find(el => el.id === passingNodeId) as Item;

    if (dir === 1 && passingItem.hasChildren) {
      // going down
      if (passingItem.showingChildren) {
        newDepth = passingItem.depth + 1;
        newParentId = passingItem.id;
      } else {
        newDepth = passingItem.depth;
        newParentId = passingItem.parentId;
      }

    } else {
      // going up
      newDepth = passingItem.depth;
      newParentId = passingItem.parentId;
    }
  }
}

const addTransition = (children) => {
  for (let i = 0; i < children.length - 1; i++) {
    children[i].classList.add('transition')
  }
}

const removeTransition = (children) => {
  for (let i = 0; i < children.length - 1; i++) {
    children[i].classList.remove('transition')
  }
}

const updateDepth = (item: Item, node: HTMLElement) => {
  item.depth = newDepth;
  node.style.paddingLeft = `${newDepth * 10}px`
}


export const DragHandler = (event, item: Item) => {
  event.preventDefault();
  event.stopPropagation();
  if (item.id === 'body') return;

  holding = 1;

  document.addEventListener("mouseup", HandleMouseUp);

  setTimeout(() => {
    document.removeEventListener("mouseup", HandleMouseUp, true);
    if (holding > 0 && !grabbing) {
      SetUpDrag();
      grabbing = true;
    }
  }, 66)

  let Item, startY, elementIndex, children, childrenLength, maxBelow, maxAbove, node;

  const SetUpDrag = () => {
    if (item.showingChildren) {
      ItemsStore.hideChildren(item)
    };

    items = get(ItemsStore);
    SelectedItemStore.set(item)
    newParentId = item.parentId;
    children = s('.left-sidebar-items').children;
    childrenLength = children.length;
    elementIndex = items.findIndex(el => el.id === item.id);
    node = children[elementIndex] as HTMLElement;
    height = node.getBoundingClientRect().height;
    halfHeight = height / 2;
    Item = { ...item };

    addTransition(children);
    grabItem(node);
    // The mouse position (in window coordinates)
    // at which the drag begins
    startY = event.clientY;

    // Min and max range of movement of grabbed element
    maxBelow = (childrenLength - 1 - elementIndex) * height;
    maxAbove = elementIndex * height * -1;

    // Register the event handlers that will respond to the mousemove events
    // and the mouseup event that follow this mousedown event.
    // Register capturing event handlers
    document.addEventListener("mousemove", moveHandler, true);
    document.addEventListener("mouseup", upHandler, true);
  }

  /**
   * This is the handler that captures mousemove events when an element
   * is being dragged. It is responsible for moving the element.
   **/
  let previousSign = 0;
  let lastTranslateValue = 0;
  let previousNodesAffected = 0;
  let gap = [0, halfHeight];
  function moveHandler(e) {
    e.stopPropagation();

    const translateValue = e.clientY - startY;

    if (translateValue < maxAbove + height || translateValue > maxBelow) return;

    const sign = translateValue < 0 ? -1 : 1;
    const translateValueAbs = Math.abs(translateValue)
    const dir = lastTranslateValue < translateValue ? 1 : -1;

    node.style.transform = `translate3D(0,${translateValue}px,0)`;

    setTimeout(() => {
      if (translateValueAbs < gap[0] || translateValueAbs > gap[1]) {

        let nodesAffected;

        if (translateValue > maxBelow) {
          nodesAffected = childrenLength - elementIndex - 1;
        } else if (translateValue < maxAbove) {
          nodesAffected = elementIndex;
        } else {
          nodesAffected = previousNodesAffected === 0 ? 1
            : Math.floor((translateValueAbs + halfHeight) / height)
        }

        // If i'm changing sign too fast to clean nodes
        if (previousSign !== 0 && previousSign !== sign) {
          cleanNodesAffected(0);
          previousNodesAffected = 0;
        };

        if (nodesAffected < previousNodesAffected) {
          // NODES AFFECTED ARE LESS THAN BEFORE
          const nodeChangedIndex = nodesAffected;
          const node = nodesChanged[nodeChangedIndex];

          handleDepth(node, dir)

        } else if (nodesAffected > 0) {
          // SELECT NEW AFFECTED NODE

          const newNodesAffected = Math.abs(nodesAffected - previousNodesAffected)

          for (let i = 0; i < newNodesAffected; i++) {
            const nodeIndex = elementIndex + (previousNodesAffected + i + 1) * sign;
            const node = children[nodeIndex];

            if (node) {
              nodesChanged.push(node)
              // nodesChanged[previousNodesAffected + i] = node;
              node.style.transform = `translate3D(0,${height * (sign * -1)}px,0)`;

              // udpate the depth to the element i'm passing
              handleDepth(node, dir)

            };
          }
        };
        cleanNodesAffected(nodesAffected);
        previousSign = sign;
        previousNodesAffected = nodesAffected;
        gap = [
          nodesAffected * height - (halfHeight * (nodesAffected > 0 ? 1 : 0)),
          halfHeight + height * nodesAffected
        ]
      }

      if (newDepth) {
        updateDepth(Item, node);
      }
      lastTranslateValue = translateValue;
    }
      , 0)
  }

  /**
   * This is the handler that captures the final mouseup event that
   * occurs at the end of a drag.
   **/
  function upHandler(e) {
    e.stopPropagation();

    document.removeEventListener("mouseup", upHandler, true);
    document.removeEventListener("mousemove", moveHandler, true);

    // clean elements before final position
    node.style.transform = '';
    cleanNodesAffected(0);
    removeTransition(children);
    ungrabItem(node);

    // add in array
    const newElPositon = elementIndex + (previousNodesAffected * previousSign);

    if (item.parentId !== newParentId || elementIndex !== newElPositon) {
      if (newParentId) {
        Item.parentId = newParentId;
      }
      ItemsStore.insertInPosition(Item, elementIndex, newElPositon);
    }

    // reset variables
    nodesChanged = [];
    holding = 0;
    newDepth = undefined;
    grabbing = false;
    newParentId = undefined;
  }
}
