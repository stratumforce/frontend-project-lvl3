import renderFeedForm from './components/form';
import renderFeeds from './components/feeds';
import renderAlert from './components/alert';

const components = {
  feedForm: renderFeedForm,
  feeds: renderFeeds,
  alert: renderAlert,
};

export default (state, component) => {
  const renderFn = components[component];

  renderFn(state);
};
