import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

import styled from 'styled-components';

export const OptionIcon = styled(FontAwesomeIcon).attrs((props) => ({
  icon: props.icon,
}))`
  color: ${(props) => (props.$highlight ? '#61bd4f' : '#aaa')};
  font-size: 12px;
`;

export const FooterIcon = styled(FontAwesomeIcon).attrs((props) => ({
  icon: props.icon,
}))`
  margin-right: 6px;
  color: #838c91;
`;

const HasAnotherCardIcon = styled(FontAwesomeIcon).attrs(() => ({
  icon: faExclamationTriangle,
}))`
  color: #ef6c00;
`;

export const HasAnotherCardIndicator = styled(({ className }) => (
  <a className={className} href="#" data-tooltip="Processo com mais de um cartão. Mostrando o primeiro.">
    <HasAnotherCardIcon />
  </a>
))`
  position: absolute;
  bottom: 5px;
  right: 5px;
  z-index: 5;
  cursor: default;
`;
