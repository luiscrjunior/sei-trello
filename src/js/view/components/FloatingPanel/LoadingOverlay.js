import React from 'react';
import styled from 'styled-components';

import loading from './loading.svg';

const Overlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1001;
`;

const Wall = styled(Overlay)`
  background-color: #fff;
  opacity: 0.8;
  z-index: 1002;
`;

const Spinner = styled.img.attrs(() => ({
  src: loading,
  opacity: 1,
}))`
  height: 36px;
  width: 36px;
  z-index: 1003;
`;

const LoadingOverlay = () => {
  return (
    <Overlay>
      <Wall />
      <Spinner />
    </Overlay>
  );
};

export default LoadingOverlay;
