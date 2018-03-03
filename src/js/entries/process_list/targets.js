import * as dom from './dom.js';

const mapMainButton = () => {
  return {
    type: 'main-button',
    ref: document.querySelector('#trello-button-placeholder'),
  };
};

const mapProcessRows = () => {
  const processAnchors = dom.findAllProcessAnchors();
  return processAnchors
    .filter((anchor) => {
      return (
        anchor.parentNode.parentNode.tagName === 'TR' &&
        anchor.parentNode.parentNode.querySelectorAll('td').length === 4
      );
    })
    .map((anchor) => {
      return {
        type: 'process-row',
        ref: anchor.parentNode.parentNode,
      };
    });
};

export const map = () => {
  return []
    .concat(mapMainButton())
    .concat(mapProcessRows());
};
