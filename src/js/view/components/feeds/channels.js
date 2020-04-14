import _ from 'lodash';

import { createElement } from '../util';
import channelLinkHandler from '../../../controllers/channel';

const onClickHandler = (event, state) => {
  event.preventDefault();
  const { target } = event;

  if (target.classList.contains('channel-link')) {
    channelLinkHandler(event, state);
  }
};

const composeUnifyingChannel = ({ feeds }) => {
  const { channels } = feeds;

  const unifyingChannel = { title: 'All', id: 0 };
  const isActive = _.every(channels, { isActive: false });
  unifyingChannel.isActive = isActive;

  return unifyingChannel;
};

const buildLink = ({ id, title }) => {
  const link = createElement('a', 'channel-link');

  link.dataset.channelId = id;
  link.href = '#';
  link.textContent = title;
  link.setAttribute('title', title);

  return link;
};

const buildItem = (channel) => {
  const item = createElement('li', 'list-group-item', 'channel');
  item.classList.toggle('channel-active', channel.isActive);

  const link = buildLink(channel);
  item.append(link);

  return item;
};

const buildList = (state) => {
  const { feeds } = state;

  const unifyingChannel = composeUnifyingChannel(state);
  const channels = [unifyingChannel, ...feeds.channels];

  const listGroup = createElement('ul', 'list-group');
  const elements = channels.map(buildItem);
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
