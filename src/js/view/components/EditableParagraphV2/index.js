import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import autosize from 'autosize';

import { Container, Textarea, Paragraph, Buttons, Button } from './styles';

const EditableParagraph = ({
  className,
  paragraphStyle,
  value,
  editing,
  onChangeState,
  onChange,
  onCancel,
  onRemove,
  buttons,
}) => {
  const [isEditing, setIsEditing] = useState(editing);
  const [width, setWidth] = useState('100%');
  const textarea = useRef(null);

  const updateValue = useCallback(() => {
    if (!textarea.current) return;
    if (textarea.current.value !== value) {
      if (onChange) onChange(textarea.current.value);
    } else {
      if (onCancel) onCancel();
    }
    setIsEditing(false);
  }, [value, onChange, onCancel]);

  const onOutsideClick = useCallback(
    (e) => {
      const clickedElement = e.target;
      const isTextArea = !!textarea.current && clickedElement.isSameNode(textarea.current);
      const isButton =
        !!textarea.current &&
        textarea.current.parentNode.contains(clickedElement) &&
        clickedElement.tagName.toLowerCase() === 'button';
      if (isTextArea || isButton) return;
      updateValue();
    },
    [updateValue]
  );

  useEffect(() => {
    document.addEventListener('mousedown', onOutsideClick);
    return () => {
      document.removeEventListener('mousedown', onOutsideClick);
    };
  }, [onOutsideClick]);

  useLayoutEffect(() => {
    if (isEditing && textarea.current) {
      autosize(textarea.current);
      if (onChangeState) onChangeState('edit');
      textarea.current.click();
    }
    if (!isEditing && !textarea.current) {
      if (onChangeState) onChangeState('show');
    }
  }, [isEditing, onChangeState]);

  const cancelEdit = () => {
    if (onCancel) onCancel();
    setIsEditing(false);
  };

  const removeItem = () => {
    if (onRemove) onRemove();
    setIsEditing(false);
  };

  const onParagraphClick = (e) => {
    setIsEditing(true);
    setWidth(`${e.target.offsetWidth}px`);
    e.preventDefault();
    e.stopPropagation();
  };

  const onKeyDown = (e) => {
    if (!e.shiftKey && e.keyCode === 13) {
      updateValue();
      e.preventDefault();
    }
    if (e.keyCode === 27) {
      cancelEdit();
      e.preventDefault();
    }
  };

  const isParagraphEmpty = !(typeof value === 'string' && value.length > 0);
  const paragraphContent = isParagraphEmpty ? 'Clique para editar...' : value;

  return (
    <Container>
      {isEditing ? (
        <Textarea
          ref={textarea}
          className={className}
          width={width}
          autoFocus={true}
          onKeyDown={onKeyDown}
          defaultValue={value}
          rows="1"
          tabIndex="0"
        ></Textarea>
      ) : (
        <Paragraph className={className} onClick={onParagraphClick} empty={isParagraphEmpty} style={paragraphStyle}>
          {paragraphContent}
        </Paragraph>
      )}
      {isEditing && buttons.length > 0 && (
        <Buttons>
          {buttons.map((button) => {
            if (button === 'save')
              return (
                <Button key={button} type="success" onClick={() => updateValue()}>
                  Salvar
                </Button>
              );
            if (button === 'remove')
              return (
                <Button key={button} type="danger" onClick={() => removeItem()}>
                  Remover
                </Button>
              );
            if (button === 'add')
              return (
                <Button key={button} type="success" onClick={() => updateValue()}>
                  Adicionar
                </Button>
              );
            if (button === 'cancel')
              return (
                <Button key={button} type="default" onClick={() => cancelEdit()}>
                  Cancelar
                </Button>
              );
          })}
        </Buttons>
      )}
    </Container>
  );
};

EditableParagraph.defaultProps = {
  editing: false,
  value: '',
  buttons: [],
};

export default EditableParagraph;
