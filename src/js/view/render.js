import renderFeedForm from './form';

const components = {
  feedForm: renderFeedForm,
};

export default (state, component) => {
  const renderFn = components[component];

  renderFn(state);
};
