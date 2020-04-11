import _ from 'lodash';

const filterChildren = (parent, predicate) =>
  [...parent.children].filter(predicate);

const getElementsContent = (elements) =>
  elements.reduce((acc, el) => {
    const tag = el.tagName;

    return { ...acc, [tag]: el.textContent.trim() };
  }, {});

const getGuid = (parent) => {
  const guidEl = parent.querySelector('guid');

  if (!_.isElement(guidEl)) {
    return null;
  }

  const isPermaLink = guidEl.getAttribute('isPermaLink');

  return {
    link: guidEl.textContent.trim(),
    isPermaLink: _.defaultTo(JSON.parse(isPermaLink), true),
  };
};

const getChannelHeaders = (channel) => {
  const headers = filterChildren(channel, (el) => el.tagName !== 'item');

  return getElementsContent(headers);
};

const getItemContent = (item) => {
  const elements = filterChildren(
    item,
    (el) => el.tagName !== 'guid' && !el.tagName.startsWith('dc:')
  );
  const content = getElementsContent(elements);

  return {
    id: _.uniqueId(),
    guid: getGuid(item),
    ...content,
  };
};

const getItems = (channel) => {
  const itemElements = filterChildren(channel, (el) => el.tagName === 'item');

  const items = itemElements.map(getItemContent);

  return items;
};

const getData = (dom) => {
  const channelEl = dom.querySelector('channel');
  const channelHeaders = getChannelHeaders(channelEl);

  const id = _.uniqueId();
  const channel = { id, ...channelHeaders };

  const items = getItems(channelEl).map((feed) => ({
    ...feed,
    channelId: id,
  }));

  return {
    channel,
    items,
  };
};

export default (dom) => {
  const parser = new DOMParser();
  const content = parser.parseFromString(dom, 'application/xml');

  if (content.querySelector('parsererror')) {
    return null;
  }

  return getData(content);
};
