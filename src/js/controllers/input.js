import { string } from 'yup';

const validate = (url) => string().required().url().isValidSync(url);

export default ({ target }, state) => {
  const { feedForm } = state;
  const { value } = target;

  feedForm.value = value;
  feedForm.isValid = validate(value);
};
