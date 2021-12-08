export const mouseEventFromPoint = (x, y, event, domView) => {
  const ev = document.createEvent("MouseEvent");
  const el = domView.elementFromPoint(x, y);

  if (!el) return;

  ev.initMouseEvent(
    event,
    true /* bubble */,
    true /* cancelable */,
    window,
    null,
    x,
    y,
    0,
    0 /* coordinates */,
    false,
    false,
    false,
    false /* modifier keys */,
    0 /*left*/,
    null
  );

  el.dispatchEvent(ev);
}