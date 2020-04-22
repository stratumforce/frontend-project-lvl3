import { watch } from 'melanke-watchjs';
import i18next from 'i18next';
import resources from './locales';

import { inputHandler, submitHandler } from './controllers';
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

  form.addEventListener('submit', (event) => submitHandler(event, state));
  form.addEventListener('input', (event) => inputHandler(event, state));
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
      error: '',
    },
    feeds: {
      channels: [],
      items: [],
    },
  };

  i18next.init({
    lng: state.app.lang,
    resources,
  });

  runWatchers(state);
  setEvents(state);
};
