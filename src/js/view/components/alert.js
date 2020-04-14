import _ from 'lodash';
import $ from 'jquery';
import i18next from 'i18next';

import { createElement, getForm } from './util';

const buildDismissBtn = () => {
  const button = createElement('button', 'close');
  button.setAttribute('type', 'button');
  button.setAttribute('aria-label', 'Close');
  button.dataset.dismiss = 'alert';

  const span = createElement('span');
  span.setAttribute('aria-hidden', 'true');
  span.innerHTML = '&times;';

  button.append(span);

  return button;
};

const wrap = (child) => {
  const wrapper = createElement('div', 'row');
  const childContainer = createElement('div', 'col');

  childContainer.append(child);
  wrapper.append(childContainer);

  const destroy = (_unused, observer) => {
    wrapper.remove();
    observer.disconnect();
  };

  const observer = new MutationObserver(destroy);
  observer.observe(childContainer, { childList: true });

  return wrapper;
};

const buildAlert = (msg) => {
  const classes = [
    'alert',
    'alert-danger',
    'alert-dismissible',
    'fade',
    'show',
  ];

  const alertEl = createElement('div', ...classes);
  alertEl.setAttribute('role', 'alert');
  alertEl.textContent = msg;

  const btn = buildDismissBtn();
  alertEl.append(btn);

  const wrapped = wrap(alertEl);

  return wrapped;
};

const removeAlert = (alertEl) => {
  $(alertEl).find('.alert').alert('close');
};

const getErrorMessage = (error) => {
  const path = 'feedForm.errors.';

  const msg = i18next.t([
    `${path}${error.code}`,
    `${path}${_.get(error, 'reponse.status')}`,
    `${path}${error.message}`,
    `${path}default`,
  ]);

  return msg;
};

const showAlert = (error) => {
  const msg = getErrorMessage(error);
  const alertEl = buildAlert(msg);

  setTimeout(() => removeAlert(alertEl), 3000);

  const parent = getForm();
  parent.append(alertEl);
};

export default (state) => showAlert(state.feedForm.error);
