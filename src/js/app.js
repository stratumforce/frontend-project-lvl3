import i18next from 'i18next';
import resources from './locales';

import initialState from './model/state';
import runWatchers from './view/watchers';
import { inputController, submitController } from './controllers';

const setEvents = (state) => {
  const form = document.forms['frm-feed'];

  form.addEventListener('submit', (event) => submitController(event, state));
  form.addEventListener('input', (event) => inputController(event, state));
};

export default () => {
  const state = initialState;

  i18next.init({
    lng: 'en',
    resources,
  });

  runWatchers(state);
  setEvents(state);
};
