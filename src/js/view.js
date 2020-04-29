import _ from 'lodash';
import i18next from 'i18next';

export const renderFeeds = (state) => {
  const { activeChannelId, channels, posts } = state.feeds;

  const channelsCards = channels.map((channel) => {
    const isActiveChannel = channel.id === activeChannelId;
    const card = document.createElement('div');
    card.classList.add('card');
    card.classList.toggle('bg-success', isActiveChannel);
    card.classList.toggle('text-light', isActiveChannel);
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = channel.title;
    const cardText = document.createElement('p');
    cardText.classList.add('card-text');
    cardText.textContent = channel.description;
    const link = document.createElement('a');
    link.classList.add('stretched-link');
    link.href = '#';
    link.dataset.id = channel.id;
    cardBody.append(cardTitle, cardText, link);
    card.append(cardBody);
    return card;
  });

  const channelsParent = document.querySelector('.channels');
  channelsParent.innerHTML = '';
  channelsParent.append(...channelsCards);

  const activePosts = posts.filter((p) => p.channelId === activeChannelId);
  const postsElements = activePosts.map((post) => {
    const linkEl = document.createElement('a');
    linkEl.href = post.link;
    linkEl.textContent = post.title;
    linkEl.setAttribute('target', '_blank');
    const wrapper = document.createElement('div');
    wrapper.append(linkEl);
    return wrapper;
  });

  const postsParent = document.querySelector('.posts');
  postsParent.innerHTML = '';
  postsParent.append(...postsElements);
};

export const renderForm = (state) => {
  const { error, isValid, processState, value } = state.form;

  const isInvalid = isValid === false;
  const isSending = processState === 'sending';

  const form = document.forms['frm-feed'];
  const inputField = form.elements.feed;
  inputField.classList.toggle('border', isInvalid);
  inputField.classList.toggle('border-danger', isInvalid);
  inputField.value = value;
  inputField.disabled = isSending;

  const button = form.querySelector('.btn');
  const isDisabled = isInvalid || !value || isSending;
  button.disabled = isDisabled;
  const spinner = button.querySelector('.spinner');
  spinner.hidden = !isSending;

  const path = 'form.error.';
  const message = error
    ? i18next.t([
        `${path}${error.code}`,
        `${path}${_.get(error, 'response.status')}`,
        `${path}${error.message}`,
        `${path}default`,
      ])
    : '';
  const errorEl = document.querySelector('.error');
  errorEl.textContent = message;
};
