import { watch } from 'melanke-watchjs';

import render from './render';

export default (state) => {
  watch(state, 'feedForm', () => render(state, 'feedForm'));
  watch(state, 'feeds', () => render(state, 'feeds'));
};
