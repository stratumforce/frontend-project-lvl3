import createElement from './util';

const getForm = () => document.forms['frm-feed'];

const getAlertMessage = ({ feedForm }) => {
  const messages = {
    duplicate: 'Feed has been already added',
    timeout: 'Timeout',
  };

  return messages[feedForm.state];
};

const isBtnDisabled = ({ feedForm }) => {
  const blacklist = ['send', 'duplicate'];

  if (!feedForm.isValid) return true;

  return blacklist.includes(feedForm.state);
};

const isInputFieldDisabled = ({ feedForm }) => {
  const blacklist = ['send', 'duplicate'];

  return blacklist.includes(feedForm.state);
};

const showAlert = (text) => {
  const row = createElement('div', 'row');
  const col = createElement('div', 'col');

  const alert = createElement('div', 'alert', 'alert-danger');
  alert.setAttribute('role', 'alert');
  alert.textContent = text;

  col.append(alert);
  row.append(col);

  const parent = document.querySelector('.frm-feed .column');
  parent.append(row);

  setTimeout(() => row.remove(), 3000);
};

const renderInputField = (state) => {
  const { feedForm } = state;

  const form = getForm();
  const inputField = form.elements.feed;

  if (!feedForm.isValid) {
    inputField.classList.add('border', 'border-danger');
  } else {
    inputField.classList.remove('border', 'border-danger');
  }

  inputField.value = feedForm.value;
  inputField.disabled = isInputFieldDisabled(state);
};

const renderBtn = (state) => {
  const form = getForm();
  const btn = form.querySelector('.btn');
  btn.disabled = isBtnDisabled(state);
};

export default (state) => {
  const { feedForm } = state;

  renderInputField(state);
  renderBtn(state);

  const alertMessage = getAlertMessage(state);
  if (alertMessage) {
    showAlert(alertMessage);
    feedForm.state = 'input';
  }
};
