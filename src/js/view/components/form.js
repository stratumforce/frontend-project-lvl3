import _ from 'lodash';

import { getForm } from './util';

const renderInputField = (state) => {
  const { feedForm } = state;

  const isInvalid = _.eq(feedForm.isValid, false);

  const form = getForm();
  const inputField = form.elements.feed;

  inputField.classList.toggle('border', isInvalid);
  inputField.classList.toggle('border-danger', isInvalid);

  inputField.value = feedForm.value;
  inputField.disabled = _.eq(feedForm.state, 'send');
};

const renderBtn = (state) => {
  const { feedForm } = state;

  const isSending = _.eq(feedForm.state, 'send');
  const isDisabled =
    _.eq(feedForm.isValid, false) || _.isEmpty(feedForm.value) || isSending;

  const form = getForm();
  const button = form.querySelector('.btn');
  button.disabled = isDisabled;

  const spinner = button.querySelector('.spinner');
  spinner.hidden = _.eq(isSending, false);
};

export default (state) => {
  renderInputField(state);
  renderBtn(state);
};
