import React from 'react';

import styled from 'styled-components';

const Box = styled.div`
  display: block;
  margin: 5px 10px 0 0;
  padding: 0;
  height: 16px;
  width: 16px;
  white-space: nowrap;
  overflow: hidden;
  min-width: 16px;
  border-radius: 2px;
  background-color: ${(props) => (props.checked ? '#5ba4cf' : '#fafbfc')};
  box-shadow: inset 0 0 0 2px ${(props) => (props.checked ? '#5ba4cf' : '#dfe1e6')};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
`;

const Checkmark = styled.span`
  width: 16px;
  height: 16px;
  content: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23FFF' viewBox='-3 -4 16 16'%3E%3Cpath d='M1.49 3.215a.667.667 0 0 0-.98.903l2.408 2.613c.358.351.892.351 1.223.02l.243-.239a1689.645 1689.645 0 0 0 2.625-2.589l.027-.026a328.23 328.23 0 0 0 2.439-2.429.667.667 0 1 0-.95-.936c-.469.476-1.314 1.316-2.426 2.417l-.027.026a1368.126 1368.126 0 0 1-2.517 2.482L1.49 3.215z'/%3E%3C/svg%3E");
  opacity: ${(props) => (props.checked ? '1' : '0')};
`;

const Checkbox = ({ checked, onClick }) => {
  return (
    <Box checked={checked} onClick={onClick}>
      <Checkmark checked={checked} />
    </Box>
  );
};

export default Checkbox;
