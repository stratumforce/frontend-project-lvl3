import renderChannels from './channels';
import renderItems from './items';

export default (state) => {
  renderChannels(state);
  renderItems(state);
};
