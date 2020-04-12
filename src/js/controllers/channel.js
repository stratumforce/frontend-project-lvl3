import { setFeedsState } from '../model/state';

const setActiveChannel = (state, activeChannelId) => {
  const { feeds } = state;

  const channels = feeds.channels.map((channel) => ({
    ...channel,
    isActive: channel.id === activeChannelId,
  }));

  setFeedsState(state, { channels });
};

export default (event, state) => {
  event.preventDefault();

  const { channelId } = event.target.dataset;

  setActiveChannel(state, channelId);
};
