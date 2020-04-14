import _ from 'lodash';

import { createElement } from '../util';
import { channelController } from '../../../controllers';

const onClickHandler = (event, state) => {
  event.preventDefault();
  const { target } = event;

  const isLinkElement = target.classList.contains('channel-link');
  if (isLinkElement) {
    channelController(event, state);
  }
};

const composeUnifyingChannel = ({ feeds }) => {
  const { channels } = feeds;

  const unifyingChannel = { title: 'All', id: 0 };
  const isActive = _.every(channels, { isActive: false });
  unifyingChannel.isActive = isActive;

  return unifyingChannel;
};

const buildLink = ({ id, title, isActive }) => {
  const utilityClasses = isActive
    ? ['font-weight-bold', 'text-dark']
    : ['text-secondary'];

  const classes = ['channel-link', 'text-decoration-none', ...utilityClasses];
  const link = createElement('a', ...classes);

  link.dataset.channelId = id;
  link.href = '#';
  link.textContent = title;
  link.setAttribute('title', title);

  return link;
};

const buildItem = (channel) => {
  const item = createElement(
    'li',
    'list-group-item',
    'channel',
    'text-truncate'
  );
  item.classList.toggle('channel-active', channel.isActive);

  const link = buildLink(channel);
  item.append(link);

  return item;
};

const buildList = (state) => {
  const { feeds } = state;

  const unifyingChannel = composeUnifyingChannel(state);
  const channels = [unifyingChannel, ...feeds.channels];
  const sortedChannels = _.sortBy(channels, ['id']);
  const elements = sortedChannels.map(buildItem);

  const listGroup = createElement('ul', 'list-group');
  listGroup.append(...elements);
  listGroup.addEventListener('click', (event) => onClickHandler(event, state));

  return listGroup;
};

export default (state) => {
  const channelsList = buildList(state);

  const parent = document.querySelector('.channels');
  parent.innerHTML = '';
  parent.append(channelsList);
};
