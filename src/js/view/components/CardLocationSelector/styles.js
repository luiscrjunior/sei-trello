import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

import styled from 'styled-components';

export const CaretIcon = styled(FontAwesomeIcon).attrs(() => ({
  icon: faCaretDown,
}))`
  display: inline-block;
  vertical-align: middle;
  overflow: hidden;
  font-size: 14px;
  color: #838c91;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: ${(props) => (props.$show ? '0 1px 0 3px' : '0')};
  opacity: ${(props) => (props.$show ? '1' : '0')};
  width: ${(props) => (props.$show ? '8px' : '0')};
`;
