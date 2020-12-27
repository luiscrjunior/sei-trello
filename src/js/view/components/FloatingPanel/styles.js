import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';

export const Panel = styled.div`
  position: relative;
  margin: 0;
  padding: 10px;
  background: #fff;
  border-radius: 3px;
  border: 1px solid #d6dadc;
  border-bottom-color: #c4c9cc;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  min-width: 300px;
  min-height: 50px;
  z-index: 1001;

  span,
  p,
  a {
    font-family: Helvetica Neue, Arial, Helvetica, sans-serif;
  }
`;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  margin-top: 5px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
`;

export const Title = styled.p`
  flex-grow: 1;
  display: block;
  margin: 3px 0 0 0;
  padding: 0;
  width: auto;
  text-align: center;
  color: #838c91;
  font-size: 14px;
`;

const AnchorButton = styled.a`
  text-decoration: none;
  cursor: pointer;
  height: auto;
  text-align: center;
  margin: 0;
  padding: 0;

  &:hover {
    text-decoration: none !important;
  }
`;

const ButtonWrapper = styled.div`
  margin: 0;
  width: 22px;
  height: auto;
`;

const IconButton = styled(FontAwesomeIcon).attrs(({ icon }) => ({
  icon: icon,
}))`
  color: #838c91;
  font-size: 22px;
`;

const Button = ({ onClick, icon, title, visible = true }) => (
  <ButtonWrapper>
    {visible && (
      <AnchorButton
        href="#"
        onClick={(e) => {
          e.preventDefault();
          if (onClick) onClick();
        }}
        title={title}
      >
        <IconButton icon={icon} />
      </AnchorButton>
    )}
  </ButtonWrapper>
);
export const CloseButton = ({ onClick, visible }) => (
  <Button icon={faTimes} title="Fechar" onClick={onClick} visible={visible} />
);

export const BackButton = ({ onClick, visible }) => (
  <Button icon={faAngleLeft} title="Voltar" onClick={onClick} visible={visible} />
);

export const Content = styled.div`
  margin: 0;
  padding: 0;
  position: relative;

  > hr {
    margin: 10px 0;
    height: 1px;
    background-color: #ddd;
    border: none;
  }
`;
