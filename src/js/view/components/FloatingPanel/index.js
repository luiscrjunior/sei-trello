import React, { useRef, useCallback, useEffect } from 'react';

import { Panel, Content, Header, Title, CloseButton, BackButton } from './styles.js';

const FloatingPanel = ({ title, onClose, onBack, className, showBackButton, children }) => {
  const panel = useRef(null);

  const onBGClick = useCallback(
    (e) => {
      const clickedElement = e.target;
      if (!panel.current) return;
      const wrapper = panel.current.closest('.btn-panel-trigger') || panel.current;
      const elementInsideWrapper = wrapper.contains(clickedElement);
      if (!elementInsideWrapper && onClose) onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.querySelector('body').addEventListener('mousedown', onBGClick);
    return () => {
      document.querySelector('body').removeEventListener('mousedown', onBGClick);
    };
  }, [onBGClick]);

  return (
    <Panel ref={panel} className={className}>
      <Header>
        <BackButton onClick={onBack} visible={showBackButton} />
        <Title>{title}</Title>
        <CloseButton onClick={onClose} visible={true} />
      </Header>
      <Content>{children}</Content>
    </Panel>
  );
};

FloatingPanel.defaultProps = {
  showBackButton: false,
  title: '',
  className: null,
  onClose: null,
};

export default FloatingPanel;
