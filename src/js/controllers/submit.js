import _ from 'lodash';

import get from '../lib/feed';

const isAvailableUrl = ({ feedForm, feeds }) => {
  const { value: url } = feedForm;
  const { channels } = feeds;

  const isAvailable = _.filter(channels, { originURL: url }).length === 0;

  return isAvailable;
};

const getFeed = ({ feedForm }) => get(feedForm.value);

const clear = (state) => {
  const { feedForm } = state;
  feedForm.value = '';
};

const lock = (state) => {
  const { feedForm } = state;
  feedForm.state = 'send';
};

const unlock = (state) => {
  const { feedForm } = state;
  feedForm.state = 'input';
};

export default (event, state) => {
  event.preventDefault();

  const { feedForm, feeds } = state;

  if (!isAvailableUrl(state)) {
    feedForm.isValid = false;
    feedForm.state = 'error';

    const error = 'Feed has been already added';
    feedForm.errors = [...feedForm.errors, error];

    return null;
  }

  lock(state);

  return getFeed(state)
    .then((data) => {
      const channel = { ...data.channel, originURL: feedForm.value };

      feeds.channels = [...feeds.channels, channel];
      feeds.items = [...feeds.items, ...data.items];
    })
    .then(() => clear(state))
    .finally(() => unlock(state));
};
