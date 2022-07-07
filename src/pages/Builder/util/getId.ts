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