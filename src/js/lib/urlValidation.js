import { string } from 'yup';

export default (url) => string().required().url().isValid(url);
