const ids = {}
export const getId = (): string => {
  const length = 5;
  const result = [];
  const letters = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789';
  const characters = letters + numbers
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    if (i === 0) {
      result.push(letters.charAt(Math.floor(
        Math.random() * letters.length
      )
      ));
      continue;
    }
    result.push(characters.charAt(Math.floor(
      Math.random() * charactersLength
    )
    ));
  }

  let finalResult = result.join('')

  if (ids[finalResult]) {
    finalResult = getId()
  } else {
    ids[finalResult] = true
  }

  return finalResult;
}

export const s = (sel) => document.querySelector(sel)
export const sa = (sel) => document.querySelectorAll(sel)

export const onLoad = (cb) => {
  window.addEventListener('load', cb)
}

export const createNode = ({ tag = 'div', ...attrs }): HTMLElement => {
  const node = document.createElement(tag);

  if (Object.keys(attrs).length > 0) {
    for (const key in attrs) {
      const value = attrs[key];

      if (value) node.setAttribute(key, value)
    }
  }

  return node;
}

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

export const getClass = (...args: string[]) => args.filter(Boolean).join(' ');