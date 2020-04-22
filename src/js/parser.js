export default (data) => {
  const parser = new DOMParser();
  const dom = parser.parseFromString(data, 'application/xml');

  if (dom.querySelector('parsererror')) {
    throw new Error('EPARSERERROR');
  }

  const channelEl = dom.querySelector('channel');
  const channel = [...channelEl.children]
    .filter((el) => el.tagName !== 'item')
    .reduce((acc, el) => ({ ...acc, [el.tagName]: el.textContent.trim() }), {});
  const items = [...channelEl.children]
    .filter((el) => el.tagName === 'item')
    .map((item) =>
      [...item.children].reduce(
        (acc, el) => ({ ...acc, [el.tagName]: el.textContent.trim() }),
        {}
      )
    );

  return {
    channel,
    items,
  };
};
