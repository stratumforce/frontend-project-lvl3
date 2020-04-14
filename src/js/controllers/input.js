import { string } from 'yup';

import { setFormState } from '../model/state';

const validate = (url) => string().required().url().isValidSync(url);

export default ({ target }, state) => {
  const { value } = target;

  const isValid = validate(value);
  setFormState(state, { value, isValid });
};
