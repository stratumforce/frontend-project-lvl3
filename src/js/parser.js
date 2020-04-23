export default (data) => {
  const parser = new DOMParser();
  const dom = parser.parseFromString(data, 'application/xml');

  if (dom.querySelector('parsererror')) {
    throw new Error('EPARSERERROR');
  }

  const channelEl = dom.querySelector('channel');
  const posts = [...channelEl.children]
    .filter((el) => el.tagName === 'item')
    .map((item) => ({
      description: item.querySelector('description').textContent,
      title: item.querySelector('title').textContent,
    }));

  return posts;
};
