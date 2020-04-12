import _ from 'lodash';
import axios from 'axios';

import { setFormState, setFeedsState } from '../model/state';

import parse from '../lib/feed';

const lock = (state) => setFormState(state, { state: 'send' });
const unlock = (state) => setFormState(state, { state: 'input' });
const invalidate = (state) => setFormState(state, { isValid: false });
const clear = (state) => setFormState(state, { value: '' });

const errorHandler = (state, error) => {
  invalidate(state);

  setFormState(state, {
    state: 'input',
    error,
  });
};

const addChannel = (state, channel) =>
  setFeedsState(state, { channels: [...state.feeds.channels, channel] });
const addItems = (state, items) =>
  setFeedsState(state, { items: [...state.feeds.items, ...items] });

const getFeed = (originURL) => {
  const corsAnywhereURL = 'https://cors-anywhere.herokuapp.com/';
  const url = `${corsAnywhereURL}${originURL}`;

  return axios.get(url, { timeout: 10000 });
};

const parseFeed = (dom) => {
  const feed = parse(dom);

  if (!feed) {
    throw new Error('EPARSERERROR');
  }

  return feed;
};

const addFeed = (state, feed, originURL, channelId) => {
  const { items } = feed;

  const channel = {
    ...feed.channel,
    id: channelId,
    originURL,
    isActive: false,
  };

  const itemsToAdd = items.map((item) => ({
    ...item,
    channelId,
    id: _.uniqueId(),
  }));

  addChannel(state, channel);
  addItems(state, itemsToAdd);
};

const getNewItems = (newItems, oldItems, keys) =>
  newItems.filter((item) => {
    const self = _.find(oldItems, _.pick(item, keys));
    return _.isUndefined(self);
  });

const updateFeed = (state, channelId) => {
  const { feeds } = state;
  const { channels, items } = feeds;

  const channel = _.find(channels, { id: channelId });
  const { originURL, lastBuildDate } = channel;

  return getFeed(originURL)
    .then((res) => parseFeed(res.data))
    .then((feed) => {
      const { lastBuildDate: newLastBuildDate } = feed.channel;

      if (newLastBuildDate === lastBuildDate) {
        return;
      }

      const { items: newItems } = feed;
      const currentItems = _.filter(items, { channelId });
      const filtered = getNewItems(newItems, currentItems, ['pubDate']);
      const itemsToAdd = filtered.map((item) => ({ ...item, channelId }));

      channel.lastBuildDate = newLastBuildDate;
      addItems(state, itemsToAdd);
    });
};

const setAutoUpdate = (state, channelId) => {
  setTimeout(() => {
    updateFeed(state, channelId).finally(setAutoUpdate(state, channelId));
  }, 5000);
};

export default (event, state) => {
  event.preventDefault();

  const { feedForm, feeds } = state;
  const { value: originURL } = feedForm;

  const isDuplicate = _.some(feeds.channels, { originURL });

  if (isDuplicate) {
    errorHandler(state, new Error('EDUPLICATE'));
    return;
  }

  lock(state);

  getFeed(originURL)
    .then((res) => parseFeed(res.data))
    .then((feed) => {
      const channelId = _.uniqueId();

      addFeed(state, feed, originURL, channelId);
      setAutoUpdate(state, channelId);
      clear(state);
    })
    .catch((error) => errorHandler(state, error))
    .finally(() => unlock(state));
};
