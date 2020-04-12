import { getForm } from './util';

const renderInputField = (state) => {
  const { feedForm } = state;
  const { isValid } = feedForm;

  const form = getForm();
  const inputField = form.elements.feed;

  inputField.classList.toggle('border', !isValid);
  inputField.classList.toggle('border-danger', !isValid);
  inputField.value = feedForm.value;
  inputField.disabled = feedForm.state === 'send';
};

const renderBtn = (state) => {
  const { feedForm } = state;
  const form = getForm();
  const btn = form.querySelector('.btn');

  const isDisabled =
    !feedForm.isValid || !feedForm.value || feedForm.state === 'send';

  btn.disabled = isDisabled;
};

export default (state) => {
  renderInputField(state);
  renderBtn(state);
};
