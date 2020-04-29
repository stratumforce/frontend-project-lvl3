export default (data) => {
  const parser = new DOMParser();
  const dom = parser.parseFromString(data, 'application/xml');

  if (dom.querySelector('parsererror')) {
    throw new Error('EPARSERERROR');
  }

  const channel = {
    title: dom.querySelector('channel title').textContent.trim(),
    description: dom.querySelector('channel description').textContent.trim(),
  };
  const posts = [...dom.querySelectorAll('item')].map((item) => ({
    description: item.querySelector('description').textContent.trim(),
    title: item.querySelector('title').textContent.trim(),
    link: item.querySelector('link').textContent.trim(),
  }));

  return {
    channel,
    posts,
  };
};
