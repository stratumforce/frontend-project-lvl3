import $ from 'jquery';
import i18next from 'i18next';

import { createElement, getForm } from './util';

const buildDismissibleBtn = () => {
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

const wrap = (alertEl) => {
  const row = createElement('div', 'row');
  const col = createElement('div', 'col');

  col.append(alertEl);
  row.append(col);

  const destroyWrapper = (_, observer) => {
    row.remove();
    observer.disconnect();
  };

  const observer = new MutationObserver(destroyWrapper);
  observer.observe(col, { childList: true });

  return row;
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

  const btn = buildDismissibleBtn();
  alertEl.append(btn);

  const wrappedAlertEl = wrap(alertEl);

  return wrappedAlertEl;
};

const removeAlert = (alertEl) => {
  $(alertEl).find('.alert').alert('close');
};

const getErrorMessage = (error) => {
  const errorPath = 'feedForm.errors.';

  const msg = i18next.t([
    `${errorPath}${error.code}`,
    `${errorPath}${error.response && error.response.status}`,
    `${errorPath}${error.message}`,
    `${errorPath}default`,
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

export default (state) => {
  const { error } = state.feedForm;

  if (error) {
    showAlert(error);
  }
};
