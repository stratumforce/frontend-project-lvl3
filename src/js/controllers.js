import _ from 'lodash';
import axios from 'axios';
import { string } from 'yup';

import parse from './parser';

const setFormState = (state, newState) => _.assign(state.form, newState);
const setFeedsState = (state, newState) => _.assign(state.feeds, newState);

const validate = (url) => string().required().url().isValidSync(url);

const errorHandler = (state, error) => {
  setFormState(state, {
    isValid: false,
    state: 'input',
    error,
  });
};

const getFeed = (originURL) => {
  const corsAnywhereURL = 'https://cors-anywhere.herokuapp.com/';
  const url = `${corsAnywhereURL}${originURL}`;

  return axios.get(url, { timeout: 10000 });
};

const updateFeed = (state, url) => {
  getFeed(url)
    .then((res) => parse(res.data))
    .then((feed) => {
      const { channels, items } = state.feeds;
      const channel = _.find(channels, { originURL: url });

      if (channel.lastBuildDate === feed.channel.lastBuildDate) {
        return;
      }

      const otherChannels = _.reject(channels, { id: channel.id });
      const updatedChannel = {
        ...channel,
        lastBuildDate: feed.channel.lastBuildDate,
      };

      const oldItems = _.filter(items, { channelId: channel.id });
      const newItems = _.chain([...feed.items])
        .differenceBy(oldItems, 'pubDate')
        .reverse()
        .map((item) =>
          _.assign({}, item, { channelId: channel.id, id: _.uniqueId() })
        )
        .value();

      setFeedsState(state, {
        channels: [...otherChannels, updatedChannel],
        items: [...state.feeds.items, ...newItems],
      });
    })
    .catch(_.noop)
    .finally(() => setTimeout(() => updateFeed(state, url), 5000));
};

export const channelController = ({ target }, state) => {
  const { channelId } = target.dataset;
  const { feeds } = state;

  const channels = feeds.channels.map((channel) => ({
    ...channel,
    isActive: channel.id === channelId,
  }));

  setFeedsState(state, { channels });
};

export const inputController = ({ target }, state) => {
  const { value } = target;

  const isValid = validate(value);
  setFormState(state, { value, isValid });
};

export const submitController = (event, state) => {
  event.preventDefault();

  const { form, feeds } = state;
  const { value: url } = form;
  const isDuplicate = _.some(feeds.channels, { originURL: url });

  if (isDuplicate) {
    errorHandler(state, new Error('EDUPLICATE'));
    return;
  }

  setFormState(state, { state: 'send' });
  getFeed(url)
    .then((res) => parse(res.data))
    .then((feed) => {
      const channelId = _.uniqueId();
      const channel = {
        ...feed.channel,
        id: channelId,
        originURL: url,
        isActive: false,
      };
      const items = [...feed.items]
        .reverse()
        .map((item) => _.assign({}, item, { channelId, id: _.uniqueId() }));
      setFeedsState(state, {
        channels: [...state.feeds.channels, channel],
        items: [...state.feeds.items, ...items],
      });
      setTimeout(() => updateFeed(state, url), 5000);
      setFormState(state, { value: '' });
    })
    .catch((error) => errorHandler(state, error))
    .finally(() => setFormState(state, { state: 'input' }));
};
