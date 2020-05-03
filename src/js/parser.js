export default (data) => {
  const parser = new DOMParser();
  const dom = parser.parseFromString(data, 'application/xml');

  if (dom.querySelector('parsererror')) {
    throw new Error('EPARSERERROR');
  }

  const channel = {
    title: dom.querySelector('channel title').textContent,
    description: dom.querySelector('channel description').textContent,
  };
  const posts = [...dom.querySelectorAll('item')].map((item) => ({
    description: item.querySelector('description').textContent,
    title: item.querySelector('title').textContent,
    link: item.querySelector('link').textContent,
  }));

  return {
    channel,
    posts,
  };
};
