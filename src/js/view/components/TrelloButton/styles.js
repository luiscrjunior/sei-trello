import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styled from 'styled-components';

export const TrelloIcon = styled(FontAwesomeIcon).attrs((props) => ({
  icon: props.icon,
}))`
  position: absolute;
  left: 3px;
  top: 3px;
  font-size: 8px;
  color: #fff;
`;
