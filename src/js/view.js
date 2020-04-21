import _ from 'lodash';
import $ from 'jquery';
import i18next from 'i18next';

import { channelController } from './controllers';

export const getForm = () => document.forms['frm-feed'];

const renderAlert = (state) => {
  const { error } = state.form;
  const path = 'form.errors.';
  const message = i18next.t([
    `${path}${error.code}`,
    `${path}${_.get(error, 'response.status')}`,
    `${path}${error.message}`,
    `${path}default`,
  ]);

  const alertEl = document.createElement('div');
  alertEl.classList.add(
    'alert',
    'alert-danger',
    'alert-dismissible',
    'fade',
    'show'
  );
  alertEl.setAttribute('role', 'alert');
  alertEl.textContent = message;

  const button = document.createElement('button');
  button.classList.add('close');
  button.setAttribute('type', 'button');
  button.setAttribute('aria-label', 'Close');
  button.dataset.dismiss = 'alert';
  const span = document.createElement('span');
  span.setAttribute('aria-hidden', 'true');
  span.innerHTML = '&times;';
  button.append(span);
  alertEl.append(button);

  setTimeout(() => {
    $(alertEl).alert('close');
  }, 3000);

  const form = getForm();
  form.append(alertEl);
};

const renderFeeds = (state) => {
  const { feeds } = state;
  const activeChannel = _.find(feeds.channels, { isActive: true });
  const isAllChannelsInactive = _.isUndefined(activeChannel);

  const unifyingChannel = {
    id: 0,
    isActive: isAllChannelsInactive,
    title: i18next.t('feeds.channels.unifyingChannel'),
  };
  const channels = [unifyingChannel, ...feeds.channels];
  const sortedChannels = _.sortBy(channels, ['id']);
  const channelsElements = sortedChannels.map((channel) => {
    const { id, isActive, title } = channel;
    const element = document.createElement('li');
    element.classList.add('list-group-item', 'channel', 'text-truncate');
    const link = document.createElement('a');
    link.classList.add('channel-link', 'text-decoration-none');
    link.classList.toggle('font-weight-bold', isActive);
    link.classList.toggle('text-dark', isActive);
    link.classList.toggle('text-secondary', !isActive);
    link.dataset.channelId = id;
    link.href = '#';
    link.textContent = title;
    link.setAttribute('title', title);
    element.append(link);
    return element;
  });
  const channelsList = document.createElement('ul');
  channelsList.classList.add('list-group');
  channelsList.append(...channelsElements);
  channelsList.addEventListener('click', (event) => {
    event.preventDefault();
    const isLinkElement = event.target.classList.contains('channel-link');
    if (isLinkElement) {
      channelController(event, state);
    }
  });

  const channelsParent = document.querySelector('.channels');
  channelsParent.innerHTML = '';
  channelsParent.append(channelsList);

  const items = isAllChannelsInactive
    ? [...feeds.items]
    : _.filter(feeds.items, { channelId: activeChannel.id });
  const sortedItems = isAllChannelsInactive
    ? _.sortBy(items, ({ pubDate }) => Date.parse(pubDate))
    : _.sortBy(items, ({ id }) => parseInt(id, 10));
  const itemsElements = [...sortedItems].reverse().map((item) => {
    const { channelId, description, link, pubDate, title } = item;

    const linkEl = document.createElement('a');
    linkEl.classList.add(
      'item-link',
      'text-dark',
      'font-weight-bold',
      'text-decoration-none'
    );
    const href = link;
    linkEl.href = href;
    linkEl.textContent = title;
    linkEl.setAttribute('title', title);
    linkEl.setAttribute('target', '_blank');
    const titleEl = document.createElement('div');
    titleEl.classList.add('card-title', 'font-weight-bold');
    titleEl.append(linkEl);
    const subtitleEl = document.createElement('div');
    subtitleEl.classList.add('card-subtitle', 'mb-2', 'text-muted', 'small');
    const channel = _.find(feeds.channels, { id: channelId });
    const date = new Date(pubDate).toString().split(' ').slice(0, 5).join(' ');
    subtitleEl.textContent = `${channel.title} / ${date}`;
    const descriptionEl = document.createElement('p');
    descriptionEl.classList.add('card-text');
    descriptionEl.textContent = description;

    const card = document.createElement('div');
    card.classList.add('card');
    const body = document.createElement('div');
    body.classList.add('card-body');
    body.append(titleEl, subtitleEl, descriptionEl);
    card.append(body);
    return card;
  });
  const itemsList = document.createElement('div');
  itemsList.classList.add('items-list');
  itemsList.append(...itemsElements);

  const itemsParent = document.querySelector('.items');
  itemsParent.innerHTML = '';
  itemsParent.append(itemsList);
};

const renderForm = (state) => {
  const { form: formState } = state;

  const isInvalid = formState.isValid === false;
  const isSending = formState.state === 'send';

  const form = getForm();
  const inputField = form.elements.feed;
  inputField.classList.toggle('border', isInvalid);
  inputField.classList.toggle('border-danger', isInvalid);
  inputField.value = formState.value;
  inputField.disabled = isSending;

  const button = form.querySelector('.btn');
  const isDisabled = isInvalid || _.isEmpty(formState.value) || isSending;
  button.disabled = isDisabled;
  const spinner = button.querySelector('.spinner');
  spinner.hidden = !isSending;
};

const mapping = {
  alert: renderAlert,
  feeds: renderFeeds,
  form: renderForm,
};

export default (state, component) => {
  const renderFunc = mapping[component];
  renderFunc(state);
};
