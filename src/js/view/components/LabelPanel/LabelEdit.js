import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Button from 'view/components/Button';
import LabelColorPicker from './LabelColorPicker';

const Wrapper = styled.div`
  margin: 15px 0 15px 0;
  padding: 0 10px 0 0;
`;

const Header = styled.p`
  margin: 0 0 5px 0;
  padding: 0;
  font-size: 12px;
  font-weight: 700;
  color: #5e6c84;
`;

const NameInput = styled.input`
  display: block;
  width: 100%;
  outline: none;
  border: none;
  box-shadow: inset 0 0 0 2px #dfe1e6;
  background-color: #fafbfc;
  box-sizing: border-box;
  -webkit-appearance: none;
  border-radius: 3px;
  line-height: 20px;
  margin-bottom: 12px;
  padding: 8px 12px;
  transition-property: background-color, border-color, box-shadow;
  transition-duration: 85ms;
  transition-timing-function: ease;

  &:hover {
    background-color: #ebecf0;
    box-shadow: inset 0 0 0 2px #dfe1e6;
  }

  &:focus {
    background-color: #fff;
    box-shadow: inset 0 0 0 2px #0079bf;
  }
`;

export const Buttons = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin: 20px 0 0 0;
  padding: 0;
`;

export const LabelButton = styled(Button)`
  font-weight: 400;
  margin-bottom: 0;
  font-size: 14px;
  outline: none;
`;

const LabelEdit = ({ mode, currentLabel, onCreate, onEdit, onDelete }) => {
  const [color, setColor] = useState(currentLabel ? currentLabel.color : null);
  const [name, setName] = useState(currentLabel ? currentLabel.name : '');
  const nameInput = useRef();

  useEffect(() => {
    if (nameInput.current) nameInput.current.focus();
  }, []);

  return (
    <Wrapper>
      <Header>Nome</Header>
      <NameInput value={name} onChange={(e) => setName(e.target.value)} ref={nameInput} />

      <Header>Selecionar uma cor</Header>
      <LabelColorPicker color={color} onSelectColor={(colorName) => setColor(colorName)} />
      <Buttons>
        {mode === 'create' && (
          <LabelButton
            type="success"
            onClick={() => {
              if (onCreate)
                onCreate({
                  name: name,
                  color: color,
                });
            }}
          >
            Criar
          </LabelButton>
        )}

        {mode === 'edit' && (
          <>
            <LabelButton
              type="success"
              onClick={() => {
                if (onEdit)
                  onEdit({
                    ...currentLabel,
                    name: name,
                    color: color,
                  });
              }}
            >
              Salvar
            </LabelButton>
            <LabelButton
              type="danger"
              onClick={() => {
                if (onDelete) onDelete(currentLabel.id);
              }}
            >
              Excluir
            </LabelButton>
          </>
        )}
      </Buttons>
    </Wrapper>
  );
};

LabelEdit.defaultProps = {
  mode: 'create',
  currentLabel: null,
};

export default LabelEdit;
