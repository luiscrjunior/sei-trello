import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

import colors from './colors';

const Wrapper = styled.div`
  margin: 0;
  padding: 0;
`;

const Line = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  margin: 8px 0 0 0;
  min-height: 32px;

  &:first-child {
    margin-top: 0;
  }
`;
const ColorBlock = styled.a`
  flex-basis: 20%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 0 0 0 8px;
  height: 32px;
  border-radius: 4px;
  background-color: ${(props) => props.$color[0]};
  cursor: pointer;

  &:first-child {
    margin-left: 0;
  }
`;

const Checkmark = styled(FontAwesomeIcon).attrs(() => ({
  icon: faCheck,
}))`
  color: #fff;
  font-size: 11px;
`;

const DefaultColorInfo = styled.div`
  flex-basis: 80%;
  margin: 0 32px 0 8px;
`;

const DefaultColorTitle = styled.p`
  margin: 0;
  padding: 0;
  font-size: 14px;
  font-weight: 400;
  color: #172b4d;
`;

const DefaultColorSubtitle = styled(DefaultColorTitle)`
  margin-top: 4px;
  color: #5e6c84;
`;

const LabelColor = ({ colorName = 'default', selected, onSelectColor }) => {
  return (
    <ColorBlock
      href="#"
      $color={colors[colorName]}
      onClick={(e) => {
        if (onSelectColor) onSelectColor(colorName === 'default' ? null : colorName);
        e.preventDefault();
      }}
      data-testid={`color-${colorName}`}
    >
      {selected && <Checkmark />}
    </ColorBlock>
  );
};

const LabelColorPicker = ({ color, onSelectColor }) => {
  return (
    <Wrapper>
      <Line>
        {['green', 'yellow', 'orange', 'red', 'purple'].map((availableColor) => (
          <LabelColor
            key={availableColor}
            colorName={availableColor}
            selected={availableColor === color}
            onSelectColor={onSelectColor}
          />
        ))}
      </Line>
      <Line>
        {['blue', 'sky', 'lime', 'pink', 'black'].map((availableColor) => (
          <LabelColor
            key={availableColor}
            colorName={availableColor}
            selected={availableColor === color}
            onSelectColor={onSelectColor}
          />
        ))}
      </Line>
      <Line>
        <LabelColor colorName="default" selected={color === null} onSelectColor={onSelectColor} />
        <DefaultColorInfo>
          <DefaultColorTitle>Sem cores.</DefaultColorTitle>
          <DefaultColorSubtitle>Isso não aparecerá na frente dos cartões.</DefaultColorSubtitle>
        </DefaultColorInfo>
      </Line>
    </Wrapper>
  );
};

LabelColorPicker.defaultProps = {
  color: null,
};

export default LabelColorPicker;
