import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import styled from 'styled-components';

export const CheckIcon = styled(FontAwesomeIcon).attrs(() => ({
  icon: faCheck,
}))`
  display: ${(props) => (props.selected ? 'inline-block' : 'none')};
  position: absolute;
  top: 8px;
  right: 5px;
  color: #999;
  font-size: 14px;
`;
