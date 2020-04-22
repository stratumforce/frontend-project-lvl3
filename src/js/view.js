import _ from 'lodash';
import $ from 'jquery';
import i18next from 'i18next';

export const getForm = () => document.forms['frm-feed'];

const renderAlert = (state) => {
  const { error } = state.form;
  const path = 'form.errors.';
  const message = i18next.t([
    `${path}${error.code}`,
    `${path}${_.get(error, 'response.status')}`,
    `${path}${error.message}`,
    `${path}default`,
  ]);

  const alertEl = document.createElement('div');
  alertEl.classList.add(
    'alert',
    'alert-danger',
    'alert-dismissible',
    'fade',
    'show'
  );
  alertEl.setAttribute('role', 'alert');
  alertEl.textContent = message;

  const button = document.createElement('button');
  button.classList.add('close');
  button.setAttribute('type', 'button');
  button.setAttribute('aria-label', 'Close');
  button.dataset.dismiss = 'alert';
  const timesSign = document.createElement('span');
  timesSign.setAttribute('aria-hidden', 'true');
  timesSign.innerHTML = '&times;';
  button.append(timesSign);
  alertEl.append(button);

  setTimeout(() => {
    $(alertEl).alert('close');
  }, 3000);

  const form = getForm();
  form.append(alertEl);
};

const renderFeeds = (state) => {
  const { posts } = state.feeds;

  const links = posts.map((post) => {
    const { link, title } = post;
    const linkEl = document.createElement('a');
    linkEl.href = link;
    linkEl.textContent = title;
    linkEl.setAttribute('target', '_blank');
    const wrapper = document.createElement('div');
    wrapper.append(linkEl);
    return wrapper;
  });

  const parent = document.querySelector('.posts');
  parent.innerHTML = '';
  parent.append(...links);
};

const renderForm = (state) => {
  const { form: formState } = state;

  const isInvalid = formState.isValid === false;
  const isSending = formState.state === 'send';

  const form = getForm();
  const inputField = form.elements.feed;
  inputField.classList.toggle('border', isInvalid);
  inputField.classList.toggle('border-danger', isInvalid);
  inputField.value = formState.value;
  inputField.disabled = isSending;

  const button = form.querySelector('.btn');
  const isDisabled = isInvalid || !formState.value || isSending;
  button.disabled = isDisabled;
  const spinner = button.querySelector('.spinner');
  spinner.hidden = !isSending;
};

const mapping = {
  alert: renderAlert,
  feeds: renderFeeds,
  form: renderForm,
};

export default (state, component) => {
  const renderFunc = mapping[component];
  renderFunc(state);
};
