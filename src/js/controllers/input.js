import urlValidation from '../lib/urlValidation';

const validateInput = (state) => {
  const { feedForm } = state;

  urlValidation(feedForm.value).then((valid) => {
    feedForm.isValid = valid;
  });
};

export default (value, state) => {
  const { feedForm } = state;

  feedForm.value = value;
  validateInput(state);
};
