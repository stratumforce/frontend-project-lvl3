import { getForm } from './util';

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

  const statesWhenDisabled = ['send', 'duplicate'];
  inputField.disabled = statesWhenDisabled.includes(feedForm.state);
};

const renderBtn = (state) => {
  const { feedForm } = state;
  const form = getForm();
  const btn = form.querySelector('.btn');

  const statesWhenDisabled = ['send', 'duplicate'];
  btn.disabled =
    !feedForm.isValid || statesWhenDisabled.includes(feedForm.state);
};

export default (state) => {
  renderInputField(state);
  renderBtn(state);
};
