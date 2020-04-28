import _ from 'lodash';
import i18next from 'i18next';

export const renderFeeds = (state) => {
  const { channels, posts } = state.feeds;

  const channelsElements = channels.map((channel) => {
    const { title, description } = channel;
    const card = document.createElement('div');
    card.classList.add('card');
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    const cardTitle = document.createElement('h5');
    cardTitle.innerText = title;
    const cardText = document.createElement('div');
    cardText.classList.add('card-text');
    cardText.innerText = description;
    cardBody.append(cardTitle, cardText);
    card.append(cardBody);
    return card;
  });

  const channelsParent = document.querySelector('.channels');
  channelsParent.innerHTML = '';
  channelsParent.append(...channelsElements);

  const postsElements = posts.map((post) => {
    const { link, title } = post;
    const linkEl = document.createElement('a');
    linkEl.href = link;
    linkEl.textContent = title;
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
