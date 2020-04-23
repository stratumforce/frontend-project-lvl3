export const renderFeeds = (state) => {
  const { posts } = state.feeds;

  const links = posts.map((post) => {
    const { link, title } = post;
    const linkEl = document.createElement('a');
    linkEl.href = link;
    linkEl.textContent = title;
    linkEl.setAttribute('target', '_blank');
    const wrapper = document.createElement('div');
    wrapper.append(linkEl);
    return wrapper;
  });

  const parent = document.querySelector('.posts');
  parent.innerHTML = '';
  parent.append(...links);
};

export const renderForm = (state) => {
  const { isValid, value, state: formState } = state.form;

  const isInvalid = isValid === false;
  const isSending = formState === 'send';

  const form = document.forms['frm-feed'];
  const inputField = form.elements.feed;
  inputField.classList.toggle('border', isInvalid);
  inputField.classList.toggle('border-danger', isInvalid);
  inputField.value = value;
  inputField.disabled = isSending;

  const button = form.querySelector('.btn');
  const isDisabled = isInvalid || !value || isSending;
  button.disabled = isDisabled;
  const spinner = button.querySelector('.spinner');
  spinner.hidden = !isSending;

  const { isNegative, message } = state.form.feedback;
  const feedbackEl = document.querySelector('.feedback');
  feedbackEl.classList.toggle('text-danger', isNegative);
  feedbackEl.textContent = message;
};
