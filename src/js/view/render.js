import renderChannels from './components/channels';
import renderFeedForm from './components/form';
import renderItems from './components/items';

const components = {
  channels: renderChannels,
  feedForm: renderFeedForm,
  items: renderItems,
};

export default (state, component) => {
  const renderFn = components[component];

  renderFn(state);
};
