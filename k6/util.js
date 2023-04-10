const pickRand = (max, min = 0) => {
  const range = max - min;
  return (Math.floor(Math.random() * range) + min);
};

const makePidList = () => {
  const productIDs = [];
  const max = 1000000;
  const min = 0.9 * max;

  for (let i = 0; i < 500; i += 1) {
    productIDs.push(pickRand(max, min));
  }
  return productIDs;
};

export { pickRand, makePidList };
