import Button from 'view/components/Button';
import styled from 'styled-components';

export const Container = styled.div``;

export const Paragraph = styled.p`
  display: block;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid transparent;
  margin: 0;
  padding: 5px;
  background-color: #fff !important;
  font-family: Helvetica Neue, Arial, Helvetica, sans-serif;
  font-size: 12px;
  white-space: pre-wrap;
  word-break: break-word;
  color: ${(props) => (props.empty ? '#aaa' : '#424242')};
  font-style: ${(props) => (props.empty ? 'italic' : 'normal')};
`;

export const Textarea = styled.textarea`
  display: block;
  overflow: hidden;
  width: ${(props) => props.width};
  box-sizing: border-box;
  margin: 0;
  padding: 5px;
  background-color: #fff !important;
  border: 1px solid #0079bf;
  box-shadow: 0 0 2px 0 #0284c6;
  font-family: Helvetica Neue, Arial, Helvetica, sans-serif;
  font-size: 12px;
  outline: none;
  resize: none;
  white-space: pre-wrap;
  word-break: break-word;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  margin: 6px 0 0 0;
  padding: 0;
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

export { SmallButton as Button };
