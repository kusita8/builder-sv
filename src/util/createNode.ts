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