import { watch } from 'melanke-watchjs';
import i18next from 'i18next';
import resources from './locales';

import { handleInput, handleSubmit } from './controllers';
import render, { getForm } from './view';

const runWatchers = (state) => {
  watch(state, 'form', (prop) => {
    if (prop !== 'error') {
      render(state, 'form');
    }
  });
  watch(state.form, 'error', () => render(state, 'alert'));
  watch(state, 'feeds', () => render(state, 'feeds'));
};

const setEvents = (state) => {
  const form = getForm();

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
      isValid: false,
      value: '',
      error: null,
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
