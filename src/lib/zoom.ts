import { selectedItem } from "../store";
import { onLoad, s } from "../utils";

let zoomArea = {} as HTMLElement
let zoomContainer = {} as HTMLElement
let leftSidebar = {} as HTMLElement
let highlightLabel = {} as HTMLElement
let userSiteBounding = { top: 0, left: 0 };
let clientX = 0;
let clientY = 0;

const current = { x: 220, y: 220, zoom: 0.22 };

const isZooming = (e: WheelEvent) => e.deltaY && (e.ctrlKey || e.deltaY % 1 !== 0);

const HandleZoom = (e: WheelEvent) => {

  if (isZooming(e)) {
    e.preventDefault();

    const nz = current.zoom + (e.deltaY * -1) / 60;

    if (nz > 2 || nz < 0.2) return;

    let oz = current.zoom,
      /// offset of container
      ox = 20,
      oy = 20,
      /// mouse cords
      mx = clientX - ox - userSiteBounding.left,
      my = clientY - oy - userSiteBounding.top,
      /// calculate click at current zoom
      ix = (mx - current.x) / oz,
      iy = (my - current.y) / oz,
      /// calculate click at new zoom
      nx = ix * nz,
      ny = iy * nz,
      /// move to the difference
      /// make sure we take mouse pointer offset into account!
      cx = mx - nx,
      cy = my - ny;

    current.zoom = nz;
    current.x = cx;
    current.y = cy;

    const transform = `translate3D(${cx}px, ${cy}px, 0px) scale(${nz})`

    zoomContainer.style.transform = transform;
    highlightLabel.style.transform = `translate3D(0px, ${nz * -100}px, 0px) scale(${1 / nz})`


  } else if (!e.ctrlKey) {
    e.stopPropagation();
  }

  setTimeout(() => {
    selectedItem.update(a => a)
  }, 20)
}

const centerZoomArea = () => {
  zoomArea.scrollLeft = window.innerWidth * .89
}

onLoad(() => {
  zoomArea = s('.user-site');
  zoomContainer = s('.user-site__inner');
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

  document.addEventListener('mousemove', e => {
    clientX = e.pageX
    clientY = e.pageY
  })

  document.addEventListener('custom:event', function (event) { alert('gotcha'); });


  centerZoomArea();
});
