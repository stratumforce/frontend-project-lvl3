import urlValidation from '../lib/urlValidation';

const validateInput = (state) => {
  const { feedForm } = state;

  urlValidation(feedForm.value).then((valid) => {
    feedForm.isValid = valid;
  });
};

export default ({ target }, state) => {
  const { feedForm } = state;

  feedForm.value = target.value;
  validateInput(state);
};
