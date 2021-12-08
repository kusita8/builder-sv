import { get } from "svelte/store";
import { DimensionsStore } from "../stores/DimensionsStore";
import { HighlightStore } from "../stores/HighlightStore";
import { onLoad } from "../util/onLoad";
import { s } from "../util/s";

let zoomArea = {} as HTMLElement
let zoomContainer = {} as HTMLElement
let userSiteBounding = { top: 0, left: 0 } as DOMRect;

let oldZoom = 1;
let currentX = 0;
let currentY = 0;

const STEP = 0.99;
const MAX_SCALE = 2.8;
const MIN_SCALE = 0.5;

const isZooming = (e: WheelEvent) =>
   e.deltaY && (e.ctrlKey || e.deltaY % 1 !== 0) && e.metaKey


const HandleZoom = (e: WheelEvent) => {

  if (isZooming(e)) {
    e.preventDefault();

    let newZoom = oldZoom;

    const factor = e.deltaY;

    if ((newZoom >= MAX_SCALE && factor < 0) || (newZoom <= MIN_SCALE && factor > 0)) return;

    const scaleChanged = Math.pow(STEP, factor);
    newZoom *= scaleChanged;


    // offset of container
    let ox = -383,
      oy = -50,
      /// mouse cords
      mx = e.clientX - ox - userSiteBounding.left,
      my = e.clientY - oy - userSiteBounding.top,
      /// calculate click at current zoom
      ix = (mx - currentX) / oldZoom,
      iy = (my - currentY) / oldZoom,
      /// calculate click at new zoom
      nx = ix * newZoom,
      ny = iy * newZoom,
      /// move to the difference
      /// make sure we take mouse pointer offset into account!
      cx = mx - nx,
      cy = my - ny;

    oldZoom = newZoom;
    currentX = cx;
    currentY = cy;

    const transform = `translate3D(${cx}px, ${cy}px, 0px) scale(${newZoom})`

    zoomContainer.style.transform = transform;

  } else if (!e.ctrlKey) {
    e.stopPropagation();
  }

  // refresh selected item to refresh highlight
  HighlightStore.refresh(50);
  HighlightStore.refresh(200);
}

const centerZoomArea = () => {
  const { width, height } = get(DimensionsStore)

  zoomArea.scrollTop = userSiteBounding.height / 2 - (height * .3) / 2;
  zoomArea.scrollLeft = userSiteBounding.width / 2 + (width * .3) / 2;
}

onLoad(() => {
  zoomArea = s('.user-site');
  zoomContainer = s('.user-site__inner');
  userSiteBounding = zoomArea.getBoundingClientRect();

  const leftSidebar = s('.left-sidebar');
  const rightSidebar = s('.right-sidebar');

  const events = ['mousewheel', 'resize', 'wheel'];
  events.forEach(ev => {
    zoomArea.addEventListener(ev, (e: WheelEvent) => { HandleZoom(e) }, { passive: false });
    window.addEventListener(ev, e => { e.preventDefault(); }, { passive: false });
    leftSidebar.addEventListener(ev, (e: MouseEvent) => {
      if (!isZooming(e as WheelEvent)) {
        e.stopPropagation();
      }
    }, { passive: false });
    rightSidebar.addEventListener(ev, (e: MouseEvent) => {
      if (!isZooming(e as WheelEvent)) {
        e.stopPropagation();
      }
    }, { passive: false });
  });

  centerZoomArea();
});
