import { watch } from 'melanke-watchjs';

import render from './render';

export default (state) => {
  watch(state, 'feedForm', () => render(state, 'feedForm'));
  watch(state.feeds, 'channels', () => render(state, 'channels'));
  watch(state.feeds, 'items', () => render(state, 'items'));
};
