import _ from 'lodash';

import { createElement } from '../util';

const sortItemsByPubDateDesc = (items) =>
  items.sort((a, b) => Date.parse(b.pubDate) - Date.parse(a.pubDate));

const buildTitle = (content) => {
  const title = createElement('div', 'card-title', 'font-weight-bold');
  title.append(content);

  return title;
};

const buildSubtitle = ({ pubDate }, { title }) => {
  const classes = ['card-subtitle', 'mb-2', 'text-muted', 'small'];
  const subtitle = createElement('div', ...classes);

  const date = new Date(pubDate).toString().split(' ').slice(0, 5).join(' ');
  subtitle.textContent = `${title} / ${date}`;

  return subtitle;
};

const buildLink = ({ title, guid, link: url }) => {
  const classes = [
    'item-link',
    'text-dark',
    'font-weight-bold',
    'text-decoration-none',
  ];

  const link = createElement('a', ...classes);
  const href = guid.isPermaLink ? guid.link : url;

  link.href = href;
  link.textContent = title;
  link.setAttribute('title', title);
  link.setAttribute('target', '_blank');

  return link;
};

const buildDescription = ({ description: desc }) => {
  const description = createElement('p', 'card-text', 'clamp');
  description.textContent = desc;

  return description;
};

const buildItemElement = (item, channel) => {
  const card = createElement('div', 'card');
  const body = createElement('div', 'card-body');

  const link = buildLink(item);
  const title = buildTitle(link);
  const subtitle = buildSubtitle(item, channel);
  const description = buildDescription(item);

  body.append(title, subtitle, description);
  card.append(body);

  return card;
};

const buildItemsList = (state) => {
  const { feeds } = state;
  const { channels } = feeds;

  const itemsList = createElement('div', 'items-list');

  const activeChannel = _.find(channels, { isActive: true });
  const items = _.isUndefined(activeChannel)
    ? [...feeds.items]
    : _.filter(feeds.items, { channelId: activeChannel.id });
  const sortedItems = sortItemsByPubDateDesc(items);

  const elements = sortedItems.map((item) => {
    const channel = _.find(channels, { id: item.channelId });
    return buildItemElement(item, channel);
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
