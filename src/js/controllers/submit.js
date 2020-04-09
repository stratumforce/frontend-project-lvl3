import _ from 'lodash';

import get from '../lib/feed';

const setFormState = (state, newState) => _.merge(state.feedForm, newState);
const lock = (state) => setFormState(state, { state: 'send' });
const unlock = (state) => setFormState(state, { state: 'input' });
const invalidateForm = (state) => setFormState(state, { isValid: false });
const clear = (state) => setFormState(state, { value: '' });

const pushError = (state, msg) => {
  const { feedForm } = state;

  setFormState(state, {
    state: 'error',
    errors: [...feedForm.errors, msg],
  });
};

const isAvailableUrl = (url, channels) => !_.some(channels, { originURL: url });

const getFeed = ({ feedForm }) => get(feedForm.value);

const addFeed = (state, feed) => {
  const { feeds } = state;

  const channel = {
    ...feed.channel,
    originURL: feed.originURL,
    isActive: false,
  };

  feeds.channels = [...feeds.channels, channel];
  feeds.items = [...feeds.items, ...feed.items];
};

const processInput = (state) => {
  const { feedForm, feeds } = state;
  const { value: url } = feedForm;

  const isAvailable = isAvailableUrl(url, feeds.channels);

  if (isAvailable) {
    lock(state);
    getFeed(state)
      .then((feed) => addFeed(state, { ...feed, originURL: url }))
      .then(() => clear(state))
      .then(() => unlock(state))
      .catch((err) => pushError(state, err.message));
  } else {
    invalidateForm(state);
    pushError(state, 'Feed has been already added');
  }
};

export default (event, state) => {
  event.preventDefault();
  processInput(state);
};
