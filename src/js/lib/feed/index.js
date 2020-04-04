import { getWithCORS, parse, getData } from './feed';

export default (url) =>
  getWithCORS(url)
    .then((res) => parse(res.data))
    .then(getData);
