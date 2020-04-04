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

  let guid = null;
  if (_.isElement(guidEl)) {
    guid = {
      content: guidEl.textContent.trim(),
      isPermaLink: guidEl.getAttribute('isPermaLink'),
    };
  }

  return guid;
};

export const getChannelHeaders = (channel) => {
  const headers = filterChildren(channel, (el) => el.tagName !== 'item');

  return getElementsContent(headers);
};

export const getItems = (channel) => {
  const itemElements = filterChildren(channel, (el) => el.tagName === 'item');

  const items = itemElements.reduce((acc, item) => {
    const elements = filterChildren(
      item,
      (el) => el.tagName !== 'guid' && !el.tagName.startsWith('dc:')
    );
    const content = getElementsContent(elements);

    const id = _.uniqueId();
    const guid = getGuid(item);

    const newItem = {
      id,
      guid,
      ...content,
    };

    return [...acc, newItem];
  }, []);

  return items;
};
