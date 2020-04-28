import _ from 'lodash';
import axios from 'axios';
import { watch } from 'melanke-watchjs';
import { mixed, string } from 'yup';
import i18next from 'i18next';
import resources from './locales';

import parse from './parser';
import { renderFeeds, renderForm } from './view';

const handleError = (state, error) => {
  const { form } = state;
  form.isValid = false;
  form.error = error;
  form.processState = 'filling';
};

const validate = (registeredUrls, url) => {
  const isValidURL = string().required().url().isValidSync(url);
  if (!isValidURL) {
    throw new Error('EINVALIDURL');
  }

  const isDuplicate = mixed().oneOf(registeredUrls).isValidSync(url);
  if (isDuplicate) {
    throw new Error('EDUPLICATE');
  }

  return true;
};

const getFeed = (url) => {
  const corsAnywhereURL = 'https://cors-anywhere.herokuapp.com/';
  const urlWithCORS = `${corsAnywhereURL}${url}`;

  return axios.get(urlWithCORS, { timeout: 10000 });
};

const updateFeed = (state, url, timeout) => {
  getFeed(url)
    .then((res) => parse(res.data))
    .then((feed) => {
      const { feeds } = state;
      const channel = feeds.channels.find((ch) => ch.url === url);

      const oldPosts = feeds.posts.filter(
        ({ channelId }) => channelId === channel.id
      );
      const newPosts = _.differenceBy(feed.posts, oldPosts, 'title');
      const postsToAdd = newPosts.map((post) => ({
        ...post,
        channelId: channel.id,
      }));
      feeds.posts.unshift(...postsToAdd);
    })
    .catch(_.noop)
    .finally(() => setTimeout(() => updateFeed(state, url, timeout), timeout));
};

const handleInput = ({ target }, state) => {
  const { form } = state;
  form.value = target.value;

  let isValid = false;
  try {
    const registeredUrls = state.feeds.channels.map(({ url }) => url);
    isValid = validate(registeredUrls, form.value);
  } catch (error) {
    handleError(state, error);
  }
  form.isValid = isValid;

  if (isValid) {
    form.error = null;
  }
};

const handleSubmit = (event, state) => {
  event.preventDefault();
  const { form, feeds } = state;
  const { value: url } = form;
  form.processState = 'sending';
  getFeed(url)
    .then((res) => parse(res.data))
    .then((feed) => {
      const channelId = _.uniqueId();
      const channel = {
        ...feed.channel,
        id: channelId,
        url,
      };
      const postsToAdd = feed.posts.map((post) => ({
        ...post,
        channelId,
      }));
      feeds.channels.push(channel);
      feeds.posts.unshift(...postsToAdd);
      form.value = '';
      form.processState = 'finished';
      const timeout = 5000;
      setTimeout(() => updateFeed(state, url, timeout), timeout);
    })
    .catch((error) => handleError(state, error));
};

const runWatchers = (state) => {
  watch(state, 'form', () => renderForm(state));
  watch(state, 'feeds', () => renderFeeds(state));
};

const setEvents = (state) => {
  const form = document.forms['frm-feed'];
  form.addEventListener('submit', (event) => handleSubmit(event, state));
  form.addEventListener('input', (event) => handleInput(event, state));
};

export default () => {
  const state = {
    app: {
      lang: 'en',
    },
    form: {
      processState: 'filling',
      isValid: true,
      value: '',
      error: null,
    },
    feeds: {
      channels: [],
      posts: [],
    },
  };

  i18next.init({
    lng: state.app.lang,
    resources,
  });

  runWatchers(state);
  setEvents(state);
};
