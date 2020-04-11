import { getForm } from './util';

const isBtnDisabled = ({ feedForm }) => {
  const blacklist = ['send', 'duplicate'];

  if (!feedForm.isValid) return true;

  return blacklist.includes(feedForm.state);
};

const isInputFieldDisabled = ({ feedForm }) => {
  const blacklist = ['send', 'duplicate'];

  return blacklist.includes(feedForm.state);
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
  renderInputField(state);
  renderBtn(state);
};
