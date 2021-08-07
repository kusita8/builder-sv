import { HighlightStore } from "../stores/HighlightStore";
import { onLoad, s, sa } from "../utils";

let zoomArea = {} as HTMLElement
let zoomContainer = {} as HTMLElement
let lateralScroll = {} as HTMLElement
let verticalScroll = [] as HTMLElement[]
let leftSidebar = {} as HTMLElement
let highlightLabel = {} as HTMLElement
let userSiteBounding = { top: 0, left: 0 } as any;
let clientX = 0;
let clientY = 0;


let oldZoom = 1;
let currentX = 0;
let currentY = 0;

const STEP = 0.99;

const isZooming = (e: WheelEvent) => e.deltaY && (e.ctrlKey || e.deltaY % 1 !== 0);

const HandleZoom = (e: WheelEvent) => {

  if (isZooming(e)) {
    e.preventDefault();

    // const nz = current.zoom + (e.deltaY * -1) / 60;

    // if (nz > 2 || nz < 0.2) return;

    let nz = oldZoom;

    const factor = e.deltaY;

    const scaleChanged = Math.pow(STEP, factor);

    nz *= scaleChanged;


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
      nx = ix * nz,
      ny = iy * nz,
      /// move to the difference
      /// make sure we take mouse pointer offset into account!
      cx = mx - nx,
      cy = my - ny;

    oldZoom = nz;
    currentX = cx;
    currentY = cy;

    const transform = `translate3D(${cx}px, ${cy}px, 0px) scale(${nz})`

    zoomContainer.style.transform = transform;

  } else if (!e.ctrlKey) {
    e.stopPropagation();
  }

  setTimeout(() => {
    // refresh selected item to refresh highlight
    HighlightStore.refresh();
  }, 20)
}

const centerZoomArea = () => {
  zoomArea.scrollTop = window.innerHeight * 0.75;
  zoomArea.scrollLeft = window.innerWidth - userSiteBounding.width / 2;
}

onLoad(() => {
  zoomArea = s('.user-site');
  zoomContainer = s('.user-site__inner');
  lateralScroll = s('.lateral-scrollspace');
  verticalScroll = sa('.vertical-scrollspace') as any;
  leftSidebar = s('.left-sidebar');
  highlightLabel = s('.highlight__label');
  userSiteBounding = zoomArea.getBoundingClientRect()

  const events = ['mousewheel', 'resize', 'wheel'];
  events.forEach(ev => {
    zoomArea.addEventListener(ev, (e: WheelEvent) => { HandleZoom(e) }, { passive: false });
    window.addEventListener(ev, e => { e.preventDefault(); }, { passive: false });
    leftSidebar.addEventListener(ev, (e: MouseEvent) => {
      !isZooming(e as WheelEvent) ? e.stopPropagation() : ''
    }
      , { passive: false });
  });

  (window as any).HandleZoom = HandleZoom;

  // document.addEventListener('mousemove', e => {
  //   clientX = e.pageX
  //   clientY = e.pageY
  // })

  document.addEventListener('custom:event', function (event) { alert('gotcha'); });


  centerZoomArea();
});
