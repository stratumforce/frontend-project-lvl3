import _ from 'lodash';

const composeIntoObject = (elements) =>
  _.chain(elements)
    .map((el) => [el.tagName, el.textContent.trim()])
    .fromPairs()
    .value();

export default (data) => {
  const parser = new DOMParser();
  const dom = parser.parseFromString(data, 'application/xml');

  if (dom.querySelector('parsererror')) {
    throw new Error('EPARSERERROR');
  }

  const channelEl = dom.querySelector('channel');
  const [itemsElements, headers] = _.partition([...channelEl.children], {
    tagName: 'item',
  });

  const channel = composeIntoObject(headers);
  const items = itemsElements.map((item) =>
    composeIntoObject([...item.children])
  );

  return {
    channel,
    items,
  };
};
