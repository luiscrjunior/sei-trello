import React, { useState } from 'react';
import EditableParagraph from 'view/components/EditableParagraphV2';
import styled from 'styled-components';

const Background = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 400px;
  height: auto;
  background-color: #fafafa;
  border: 1px solid #ddd;
`;

const Content = styled.div`
  margin-top: 50px;
  margin-bottom: 0;
  width: 300px;
  height: auto;

  &:last-child {
    margin-bottom: 50px;
  }
`;

const StyledEditableParagraph = styled(EditableParagraph)`
  font-size: 14px;
  font-weight: 600;
`;

const EditableParagraphPlayground = () => {
  const [texts, setTexts] = useState([null, null, null]);

  const onChange = (idx, value) => {
    const newTexts = [...texts];
    newTexts[idx] = value;
    setTexts(newTexts);
  };

  return (
    <Background>
      <Content>
        <EditableParagraph value={texts[0]} onChange={onChange.bind(this, 0)} />
      </Content>
      <Content>
        <StyledEditableParagraph value={texts[1]} onChange={onChange.bind(this, 1)} />
      </Content>
      <Content>
        <EditableParagraph
          value={texts[2]}
          onChange={onChange.bind(this, 2)}
          buttons={['save', 'cancel', 'remove']}
          onRemove={() => alert('Item removido.')}
        />
      </Content>
      <Content>
        <EditableParagraph value={texts[3]} onChange={onChange.bind(this, 3)} buttons={['add', 'cancel']} editing />
      </Content>
    </Background>
  );
};

export default EditableParagraphPlayground;
