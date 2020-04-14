import renderFeedForm from './components/form';
import renderFeeds from './components/feeds';
import renderAlert from './components/alert';

const mapping = {
  feedForm: renderFeedForm,
  feeds: renderFeeds,
  alert: renderAlert,
};

export default (state, component) => {
  const renderFn = mapping[component];

  renderFn(state);
};
