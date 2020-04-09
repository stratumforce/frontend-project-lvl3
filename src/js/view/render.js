import renderFeedForm from './components/form';
import renderFeeds from './components/feeds';

const components = {
  feedForm: renderFeedForm,
  feeds: renderFeeds,
};

export default (state, component) => {
  const renderFn = components[component];

  renderFn(state);
};
