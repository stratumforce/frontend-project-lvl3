import _ from 'lodash';
import axios from 'axios';
import { string } from 'yup';

import parse from './parser';

const errorHandler = (state, error) => {
  const { form } = state;
  form.isValid = false;
  form.state = 'input';
  form.error = error;
};

const validate = (state, url) => {
  const isValidURL = string().required().url().isValidSync(url);
  if (!isValidURL) {
    return false;
  }

  const { channels } = state.feeds;
  const isDuplicate = channels.some(({ originURL }) => originURL === url);
  if (isDuplicate) {
    errorHandler(state, new Error('EDUPLICATE'));
    return false;
  }

  return true;
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
      const { feeds } = state;
      const { channels, items } = feeds;
      const channel = channels.find(({ originURL }) => originURL === url);

      if (channel.lastBuildDate === feed.channel.lastBuildDate) {
        return;
      }

      channel.lastBuildDate = feed.channel.lastBuildDate;

      const oldItems = items.filter(
        ({ channelId }) => channelId === channel.id
      );
      const newItems = feed.items.filter(
        (item) => !oldItems.find((oldItem) => oldItem.pubDate === item.pubDate)
      );
      const itemsToAdd = [...newItems]
        .reverse()
        .map((item) => ({ ...item, channelId: channel.id, id: _.uniqueId() }));
      feeds.items.push(...itemsToAdd);
    })
    .catch(_.noop)
    .finally(() => setTimeout(() => updateFeed(state, url), 5000));
};

export const channelClickHandler = ({ target }, state) => {
  const { channelId } = target.dataset;
  const { feeds } = state;
  feeds.activeChannelId = channelId;
};

export const inputHandler = ({ target }, state) => {
  const { form } = state;
  form.value = target.value;
  form.isValid = validate(state, form.value);
};

export const submitHandler = (event, state) => {
  event.preventDefault();
  const { form, feeds } = state;
  const { value: url } = form;
  form.state = 'send';
  getFeed(url)
    .then((res) => parse(res.data))
    .then((feed) => {
      const channelId = _.uniqueId();
      const channel = {
        ...feed.channel,
        id: channelId,
        originURL: url,
      };
      const items = [...feed.items]
        .reverse()
        .map((item) => ({ ...item, channelId, id: _.uniqueId() }));
      feeds.channels.push(channel);
      feeds.items.push(...items);
      setTimeout(() => updateFeed(state, url), 5000);
      form.value = '';
    })
    .catch((error) => errorHandler(state, error))
    .finally(() => {
      form.state = 'input';
    });
};
