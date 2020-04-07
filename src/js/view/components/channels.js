import createElement from './util';

const buildChannelsList = ({ feeds }) => {
  const listGroup = createElement('ul', 'list-group');

  const mainChannel = { title: 'All', id: 0 };
  const channels = [mainChannel, ...feeds.channels];

  const elements = channels.map(({ id, title }) => {
    const li = createElement('li', 'list-group-item');

    const link = createElement('a', 'channel-link');
    link.dataset.channelId = id;
    link.href = '#';
    link.textContent = title;
    link.setAttribute('title', title);

    li.append(link);

    return li;
  });

  listGroup.append(...elements);

  return listGroup;
};

export default (state) => {
  const channelsList = buildChannelsList(state);

  const parent = document.querySelector('.channels');
  parent.innerHTML = '';
  parent.append(channelsList);
};
