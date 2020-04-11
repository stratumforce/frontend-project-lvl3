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

const getFeed = ({ feedForm }) => {
  const corsAnywhereURL = 'https://cors-anywhere.herokuapp.com/';
  const url = `${corsAnywhereURL}${feedForm.value}`;

  return axios.get(url);
};

const parseFeed = (dom) => {
  const feed = parse(dom);

  if (!feed) {
    throw new Error('EPARSERERROR');
  }

  return feed;
};

const addFeed = (state, feed, originURL) => {
  const { feeds } = state;

  const channel = {
    ...feed.channel,
    originURL,
    isActive: false,
  };

  const { items } = feed;
  setFeedsState(state, {
    channels: [...feeds.channels, channel],
    items: [...feeds.items, ...items],
  });
};

export default (event, state) => {
  event.preventDefault();

  const { feedForm, feeds } = state;
  const { value: url } = feedForm;

  const isDuplicate = _.some(feeds.channels, { originURL: url });

  if (isDuplicate) {
    errorHandler(state, new Error('EDUPLICATE'));
    return;
  }

  lock(state);

  getFeed(state)
    .then((res) => parseFeed(res.data))
    .then((feed) => addFeed(state, feed, url))
    .then(() => clear(state))
    .catch((error) => errorHandler(state, error))
    .finally(() => unlock(state));
};
