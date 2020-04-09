import initialState from './model/state';
import runWatchers from './view/watchers';
import { inputController, submitController } from './controllers/controllers';

export default () => {
  const state = initialState;

  runWatchers(state);

  const form = document.forms['frm-feed'];

  form.addEventListener('submit', (event) => submitController(event, state));
  form.addEventListener('input', (event) => inputController(event, state));
};
