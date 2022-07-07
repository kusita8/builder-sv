export const closeOnOutsideClick = (className: string, cb: Function) => {
  const handleClickOutside = (e) => {
    const element = e.target.closest(className)
    if (!element) {
      cb();
      window.removeEventListener('click', handleClickOutside);
    }
  }
  window.addEventListener('click', handleClickOutside, true)
}