const composeChannels = ({ feeds }, activeChannelId) => {
  const channels = [...feeds.channels].reduce((acc, channel) => {
    const isActive = channel.id === activeChannelId;

    return [...acc, { ...channel, isActive }];
  }, []);

  return channels;
};

const setActiveChannel = (state, activeChannelId) => {
  const { feeds } = state;

  feeds.channels = composeChannels(state, activeChannelId);
};

export default (event, state) => {
  event.preventDefault();

  const { channelId } = event.target.dataset;

  if (channelId) {
    setActiveChannel(state, channelId);
  }
};
