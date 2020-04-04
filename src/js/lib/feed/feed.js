import _ from 'lodash';

import fetchURL from '../fetch';
import { getChannelHeaders, getItems } from './util';

const get = (url) => {
  const promise = fetchURL(url);

  return promise;
};

export const getWithCORS = (url) => {
  const corsAnywhereURL = 'https://cors-anywhere.herokuapp.com/';

  return get(`${corsAnywhereURL}${url}`);
};

export const parse = (data) => {
  const parser = new DOMParser();
  const content = parser.parseFromString(data, 'application/xml');

  if (content.querySelector('parsererror')) {
    throw new Error('Invalid URL');
  }

  return content;
};

export const getData = (dom) => {
  const channelEl = dom.querySelector('channel');
  const channelHeaders = getChannelHeaders(channelEl);

  const id = _.uniqueId();
  const channel = { id, ...channelHeaders };

  const items = getItems(channelEl).map((feed) => ({
    ...feed,
    channelId: id,
  }));

  return {
    channel,
    items,
  };
};
