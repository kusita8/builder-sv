import { DimensionsStore } from "../../stores/DimensionsStore";
import { HighlightStore } from "../../stores/HighlightStore";


let holding = 0;

const HandleMouseUp = () => {
  holding -= 1
}

export const DragHandler = (e: MouseEvent, type: string, node: HTMLElement) => {
  holding = 1;
  document.addEventListener("mouseup", HandleMouseUp);

  setTimeout(() => {
    document.removeEventListener("mouseup", HandleMouseUp, true);

    if (holding > 0) {
      SetUpDrag();
    }
  }, 100)

  let scale,
    startY,
    startX,
    startW,
    startH,
    width,
    height

  const SetUpDrag = () => {
    scale = node.getBoundingClientRect().width / node.offsetWidth;
    startY = e.clientY
    startX = e.clientX
    startW = node.getAttribute('width') as any * 1
    startH = node.getAttribute('height') as any * 1
    width = startW,
      height = startH

    document.addEventListener("mousemove", moveHandler, true);
    document.addEventListener("mouseup", upHandler, true);
  }

  const moveHandler = (e) => {
    if (type === 'width') {
      width = Math.round((startW + (e.clientX - startX) * (1 / scale)));
      node.style.width = `${width}px`;
      DimensionsStore.setWidth(width)
    } else {
      height = Math.round((startH + (e.clientY - startY) * (1 / scale)));
      node.style.height = `${height}px`;
      DimensionsStore.setHeigth(height)
    }
    // update highlight
    HighlightStore.refresh();
  }

  const upHandler = () => {
    node.setAttribute('width', width + '');
    node.setAttribute('height', height + '');

    document.removeEventListener("mousemove", moveHandler, true);
    document.removeEventListener("mouseup", upHandler, true);
  }
}