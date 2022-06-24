export const debounce = (func: Function, wait?: number): (() => void) => {
  let timeout: any;

  return function (this: Function, ...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait || 66);
  };
};
