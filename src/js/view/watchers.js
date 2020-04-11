import { watch } from 'melanke-watchjs';

import render from './render';

export default (state) => {
  watch(state, 'feedForm', (prop) => {
    if (prop !== 'error') {
      render(state, 'feedForm');
    }
  });
  watch(state.feedForm, 'error', () => render(state, 'alert'));
  watch(state, 'feeds', () => render(state, 'feeds'));
};
