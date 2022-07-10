export const waitForValue = (cb) =>
  new Promise((res) => {
    const checkValue = () => {
      if (cb()) res(true);
      else setTimeout(checkValue, 50);
    };
    checkValue();
  });
