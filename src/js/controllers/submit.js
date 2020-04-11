import _ from 'lodash';

import { setFormState, setFeedsState } from '../model/state';

import get from '../lib/feed';

const lock = (state) => setFormState(state, { state: 'send' });
const unlock = (state) => setFormState(state, { state: 'input' });
const invalidateForm = (state) => setFormState(state, { isValid: false });
const clear = (state) => setFormState(state, { value: '' });

const releaseForm = (state) => {
  clear(state);
  unlock(state);
};

const errorHandler = (state, error) => {
  setFormState(state, {
    state: 'input',
    error,
  });
};

const isAvailableUrl = (url, channels) => !_.some(channels, { originURL: url });

const getFeed = ({ feedForm }) => get(feedForm.value);

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

const processInput = (state) => {
  const { feedForm, feeds } = state;
  const { value: url } = feedForm;

  const isAvailable = isAvailableUrl(url, feeds.channels);

  if (isAvailable) {
    lock(state);
    getFeed(state)
      .then((feed) => addFeed(state, feed, url))
      .then(() => releaseForm(state))
      .catch((error) => errorHandler(state, error));
  } else {
    invalidateForm(state);
    errorHandler(state, new Error('EDUPLICATE'));
  }
};

export default (event, state) => {
  event.preventDefault();
  processInput(state);
};
