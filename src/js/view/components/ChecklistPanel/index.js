import React, { useState } from 'react';
import FloatingPanel from 'view/components/FloatingPanel';
import ChecklistItem from './ChecklistItem';

import styled from 'styled-components';

const Panel = styled(FloatingPanel)`
  position: absolute;
  top: 20px;
  right: 42px;
  min-width: auto;
  width: 240px;
`;

const ChecklistItems = styled.ul`
  margin: 15px 0 15px 0;
  padding: 0;
`;

const ChecklistPanel = () => {
  const [checked, setChecked] = useState(false);

  return (
    <Panel title="Checklist">
      <ChecklistItems>
        <ChecklistItem onClick={() => setChecked(!checked)} checked={checked} />
      </ChecklistItems>
    </Panel>
  );
};

export default ChecklistPanel;
