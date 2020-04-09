import _ from 'lodash';

import createElement from '../util';

const getActiveChannelItems = (items, channelId) =>
  items.filter((item) => item.channelId === channelId);

const getItems = ({ feeds }) => {
  const { channels } = feeds;
  const activeChannel = _.find(channels, { isActive: true });

  if (activeChannel === undefined) {
    return [...feeds.items];
  }

  const items = getActiveChannelItems(feeds.items, activeChannel.id);

  return items;
};

const createTitle = (content) => {
  const title = createElement('div', 'card-title');

  title.innerHTML = `<strong></strong>`;
  title.firstChild.append(content);

  return title;
};

const createSubtitle = ({ pubDate }, { title }) => {
  const subtitle = createElement('div', 'card-subtitle', 'mb-2', 'text-muted');

  subtitle.textContent = `${title} / ${pubDate}`;

  return subtitle;
};

const createLink = ({ title, guid, link: url }) => {
  const link = createElement('a', 'item-link');
  const href = guid.isPermaLink ? guid.link : url;

  link.href = href;
  link.textContent = title;
  link.setAttribute('title', title);
  link.setAttribute('target', '_blank');

  return link;
};

const createDescription = ({ description: desc }) => {
  const description = createElement('p', 'card-text');

  description.textContent = desc;

  return description;
};

const buildElement = (feed, channel) => {
  const card = createElement('div', 'card');
  const body = createElement('div', 'card-body');

  const link = createLink(feed);
  const title = createTitle(link);
  const subtitle = createSubtitle(feed, channel);
  const description = createDescription(feed);

  body.append(title, subtitle, description);
  card.append(body);

  return card;
};

const buildItemsList = (state) => {
  const { feeds } = state;
  const { channels } = feeds;

  const itemsList = createElement('div', 'items-list');

  const items = getItems(state);
  const elements = items.map((item) => {
    const channel = _.find(channels, { id: item.channelId });
    return buildElement(item, channel);
  });

  itemsList.append(...elements);

  return itemsList;
};

export default (state) => {
  const itemsList = buildItemsList(state);

  const parent = document.querySelector('.items');
  parent.innerHTML = '';
  parent.append(itemsList);
};
