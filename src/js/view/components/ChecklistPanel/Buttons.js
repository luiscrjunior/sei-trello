import styled from 'styled-components';
import Button from 'view/components/Button';

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 10px;
`;

const SmallButton = styled(Button)`
  font-size: 11px;
  font-weight: 500;
  padding: 5px 10px;
  margin-left: 5px;

  &:first-child {
    margin-left: 0;
  }
`;

export { Buttons, SmallButton as Button };
