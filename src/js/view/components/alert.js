import $ from 'jquery';

import createElement from './util';

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

export default (msg, timeout) => {
  const alertEl = buildAlert(msg);

  if (timeout) {
    setTimeout(() => removeAlert(alertEl), timeout);
  }

  return alertEl;
};
