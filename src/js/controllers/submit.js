import _ from 'lodash';
import i18next from 'i18next';

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

const errorHandler = (state, error) => {
  const errorPath = 'feedForm.errors.';

  const msg = i18next.t([
    `${errorPath}${error.code}`,
    `${errorPath}${error.response && error.response.status}`,
    `${errorPath}default`,
  ]);

  pushError(state, msg);
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
      .then(() => {
        clear(state);
        unlock(state);
      })
      .catch((error) => errorHandler(state, error));
  } else {
    invalidateForm(state);
    pushError(state, 'Feed has been already added');
  }
};

export default (event, state) => {
  event.preventDefault();
  processInput(state);
};
