import _ from 'lodash';

import { createElement } from '../util';

const sortItemsByPubDateDesc = (items) =>
  items.sort((a, b) => Date.parse(b.pubDate) - Date.parse(a.pubDate));

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

const buildItemElement = (item, channel) => {
  const card = createElement('div', 'card');
  const body = createElement('div', 'card-body');

  const link = createLink(item);
  const title = createTitle(link);
  const subtitle = createSubtitle(item, channel);
  const description = createDescription(item);

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
  const sorted = sortItemsByPubDateDesc(items);

  const elements = sorted.map((item) => {
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
