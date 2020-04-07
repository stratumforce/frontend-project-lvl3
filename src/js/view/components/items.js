import createElement from './util';

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

const createLink = ({ title, link: url }) => {
  const link = createElement('a', 'item-link');

  link.href = url;
  link.textContent = title;
  link.setAttribute('title', title);

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

const buildItemsList = ({ feeds }) => {
  const { channels } = feeds;

  const itemsList = createElement('div', 'items-list');

  const elements = [...feeds.items].map((feed) => {
    const channel = channels.find((ch) => ch.id === feed.channelId);
    return buildElement(feed, channel);
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
