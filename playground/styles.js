import styled from 'styled-components';

import bgCard from './bgCard.png';

export const App = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px;
  margin: 0;
  width: 100%;
  height: 100%;
`;

export const Header = styled.div`
  height: auto;
  padding: 15px;
`;

export const Content = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Button = styled.button`
  font-size: 14px;
  padding: 6px 12px;
  margin-bottom: 0;

  display: inline-block;
  text-decoration: none;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-image: none;
  border: 1px solid transparent;
  margin-left: 10px;

  &:first-child {
    margin-left: 0;
  }

  &:focus,
  &:active:focus {
    outline: 0;
  }

  &:hover,
  &:focus {
    color: #fff;
    background-color: #0069d9;
    border-color: #0062cc;
  }

  &:active {
    background-image: none;
    outline: 0;
    -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
    box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
  }

  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
  border-radius: 3px;

  box-shadow: ${(props) => (props.selected ? '0px -2px 4px 0px #1A237E inset' : 'none')};
`;

export const TrelloCardBG = styled.div`
  position: relative;
  padding: 0;
  margin: 0;
  width: 337px;
  height: 219px;
  background-image: url(${bgCard});
  background-repeat: no-repeat;
  background-position: left top;
`;
