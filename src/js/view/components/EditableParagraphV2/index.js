import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import autosize from 'autosize';

import { Container, Textarea, Paragraph, Buttons, Button } from './styles';

const EditableParagraph = (props) => {
  const [editing, setEditing] = useState(props.editing);
  const [width, setWidth] = useState('100%');
  const textarea = useRef(null);
  const buttons = useRef(null);

  useEffect(() => {
    document.querySelector('body').addEventListener('click', onOutsideClick);
    return () => {
      document.querySelector('body').removeEventListener('click', onOutsideClick);
    };
  }, []);

  useLayoutEffect(() => {
    if (editing && textarea.current) {
      autosize(textarea.current);
      if (props.onChangeState) props.onChangeState('edit');
      textarea.current.click();
    }
    if (!editing && !textarea.current) {
      if (props.onChangeState) props.onChangeState('show');
    }
  }, [editing]);

  const onOutsideClick = useCallback((e) => {
    if (!textarea.current) return;
    const clickedElement = e.target;
    const parentNode = textarea.current.parentNode;
    const elementInsideContainer = parentNode.contains(clickedElement);
    if (!clickedElement.isSameNode(buttons.current) && elementInsideContainer) {
      return;
    }
    updateValue();
  });

  const updateValue = () => {
    if (!textarea.current) return;
    if (textarea.current.value !== props.value && props.onChange) props.onChange(textarea.current.value);
    setEditing(false);
  };

  const cancelEdit = () => {
    if (props.onCancel) props.onCancel();
    setEditing(false);
  };

  const removeItem = () => {
    if (props.onRemove) props.onRemove();
    setEditing(false);
  };

  const onParagraphClick = (e) => {
    setEditing(true);
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

  const isParagraphEmpty = !(typeof props.value === 'string' && props.value.length > 0);
  const paragraphContent = isParagraphEmpty ? 'Clique para editar...' : props.value;

  return (
    <Container>
      {editing ? (
        <Textarea
          ref={textarea}
          className={props.className}
          width={width}
          autoFocus={true}
          onKeyDown={onKeyDown}
          defaultValue={props.value}
          rows="1"
          tabIndex="0"
        ></Textarea>
      ) : (
        <Paragraph className={props.className} onClick={onParagraphClick} empty={isParagraphEmpty}>
          {paragraphContent}
        </Paragraph>
      )}
      {editing && props.buttons.length > 0 && (
        <Buttons ref={buttons}>
          {props.buttons.map((button) => {
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
