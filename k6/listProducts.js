import http from 'k6/http';
import { sleep } from 'k6';
import { pickRand, makePidList } from './util.js';

const count = 100;
const max = 1000000 / count;
const min = (0.9 * max) / count;

export const options = {
  vus: 500,
  duration: '30s',
};

export default function () {
  const page = pickRand(max, min);
  http.get(`http://localhost:3005/products?count=${count}&page=${page}`);
  sleep(0);
}
