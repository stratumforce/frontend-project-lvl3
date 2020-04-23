import { watch } from 'melanke-watchjs';
import i18next from 'i18next';
import resources from './locales';

import { handleInput, handleSubmit } from './controllers';
import { renderFeeds, renderForm } from './view';

const runWatchers = (state) => {
  watch(state, 'form', () => renderForm(state));
  watch(state, 'feeds', () => renderFeeds(state));
};

const setEvents = (state) => {
  const form = document.forms['frm-feed'];
  form.addEventListener('submit', (event) => handleSubmit(event, state));
  form.addEventListener('input', (event) => handleInput(event, state));
};

export default () => {
  const state = {
    app: {
      lang: 'en',
    },
    form: {
      state: 'input',
      isValid: true,
      value: '',
      feedback: {
        isNegative: false,
        message: '',
      },
    },
    feeds: {
      channels: [],
      posts: [],
    },
  };

  i18next.init({
    lng: state.app.lang,
    resources,
  });

  runWatchers(state);
  setEvents(state);
};
