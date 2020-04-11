export const createElement = (tag, ...classes) => {
  const el = document.createElement(tag);
  el.classList.add(...classes);

  return el;
};

export const getForm = () => document.forms['frm-feed'];
