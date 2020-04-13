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

const updateChannel = (state, channel, newState) => {
  const { channels } = state.feeds;

  const otherChannels = _.reject(channels, { id: channel.id });
  const updatedChannel = { ...channel, ...newState };

  setFeedsState(state, { channels: [...otherChannels, updatedChannel] });
};

const getNewItems = (items, oldItems) =>
  items.filter((item) => {
    const entries = _.pick(item, ['pubDate']);
    const self = _.find(oldItems, entries);

    return _.isUndefined(self);
  });

const addNewItems = (state, feed, channel) => {
  const { items } = state.feeds;
  const { id: channelId, lastBuildDate } = channel;
  const { lastBuildDate: newLastBuildDate } = feed.channel;

  if (newLastBuildDate === lastBuildDate) {
    return;
  }

  const currentItems = _.filter(items, { channelId });
  const newItems = getNewItems(feed.items, currentItems, ['pubDate']);
  const itemsToAdd = newItems.map((item) => ({ ...item, channelId }));

  updateChannel(state, channel, { lastBuildDate: newLastBuildDate });
  addItems(state, itemsToAdd);
};

const updateFeed = (state, channelId) => {
  const { channels } = state.feeds;

  const channel = _.find(channels, { id: channelId });
  const { originURL } = channel;

  return getFeed(originURL)
    .then((res) => parse(res.data))
    .then((feed) => addNewItems(state, feed, channel));
};

const setAutoUpdate = (state, channelId) => {
  setTimeout(() => {
    updateFeed(state, channelId)
      .catch(_.noop)
      .finally(setAutoUpdate(state, channelId));
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
    .then((res) => parse(res.data))
    .then((feed) => {
      const channelId = _.uniqueId();

      addFeed(state, feed, originURL, channelId);
      setAutoUpdate(state, channelId);
      clear(state);
    })
    .catch((error) => errorHandler(state, error))
    .finally(() => unlock(state));
};
