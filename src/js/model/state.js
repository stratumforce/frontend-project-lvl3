import _ from 'lodash';

export const setFormState = (state, newState) =>
  _.assign(state.feedForm, newState);

export const setFeedsState = (state, newState) =>
  _.assign(state.feeds, newState);

export default {
  app: {
    lang: 'en',
  },
  feedForm: {
    state: 'input',
    isValid: false,
    value: '',
    error: '',
  },
  feeds: {
    channels: [],
    items: [],
  },
};
