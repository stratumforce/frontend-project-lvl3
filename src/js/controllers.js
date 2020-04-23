import _ from 'lodash';
import axios from 'axios';
import { string } from 'yup';
import i18next from 'i18next';

import parse from './parser';

const handleError = (state, error) => {
  const { form } = state;
  const path = 'form.feedback.';
  const message = i18next.t([
    `${path}${error.code}`,
    `${path}${_.get(error, 'response.status')}`,
    `${path}${error.message}`,
    `${path}default`,
  ]);
  form.isValid = false;
  form.state = 'input';
  form.feedback.isNegative = true;
  form.feedback.message = message;
};

const validate = (state, url) => {
  const isValidURL = string().required().url().isValidSync(url);
  if (!isValidURL) {
    return false;
  }

  const { channels } = state.feeds;
  const isDuplicate = channels.some(({ originURL }) => originURL === url);
  if (isDuplicate) {
    handleError(state, new Error('EDUPLICATE'));
    return false;
  }

  return true;
};

const getFeed = (url) => {
  const corsAnywhereURL = 'https://cors-anywhere.herokuapp.com/';
  const urlWithCORS = `${corsAnywhereURL}${url}`;

  return axios.get(urlWithCORS, { timeout: 10000 });
};

const updateFeed = (state, url) => {
  getFeed(url)
    .then((res) => parse(res.data))
    .then((feed) => {
      const { feeds } = state;
      const { channels, posts } = feeds;
      const channel = channels.find(({ originURL }) => originURL === url);

      if (channel.lastBuildDate === feed.channel.lastBuildDate) {
        return;
      }

      channel.lastBuildDate = feed.channel.lastBuildDate;

      const oldPosts = posts.filter(
        ({ channelId }) => channelId === channel.id
      );
      const newPosts = feed.items.filter(
        (post) => !oldPosts.find((oldPost) => oldPost.pubDate === post.pubDate)
      );
      const postsToAdd = [...newPosts].map((post) => ({
        ...post,
        channelId: channel.id,
      }));
      feeds.posts.unshift(...postsToAdd);
    })
    .catch(_.noop)
    .finally(() => setTimeout(() => updateFeed(state, url), 5000));
};

export const handleInput = ({ target }, state) => {
  const { form } = state;
  form.value = target.value;
  const isValid = validate(state, form.value);
  form.isValid = isValid;
  if (isValid || form.state === 'added') {
    form.feedback = { isNegative: false, message: '' };
  }
};

export const handleSubmit = (event, state) => {
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
      const posts = feed.items.map((post) => ({
        ...post,
        channelId,
      }));
      feeds.channels.push(channel);
      feeds.posts.unshift(...posts);
      form.value = '';
      setTimeout(() => updateFeed(state, url), 5000);
    })
    .catch((error) => handleError(state, error))
    .finally(() => {
      form.state = 'added';
      const message = i18next.t('form.feedback.feedAdded');
      form.feedback = { isNegative: false, message };
    });
};
