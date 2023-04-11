import http from 'k6/http';
import { sleep } from 'k6';
import { pickRand, makePidList } from './util.js';

const productIDs = makePidList();
const max = productIDs.length;

export const options = {
  vus: 500,
  duration: '30s',
};

export default function () {
  const productID = productIDs[pickRand(max)];
  http.get(`http://localhost:3005/products/${productID}/styles`, {
    tags: { name: 'getStylesURL' },
  });
  sleep(0);
}
