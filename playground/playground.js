import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import components from './components';

if (module.hot) module.hot.accept();

import { App, Header, Content, Button } from './styles';

const Playground = () => {
  const [componentName, setComponentName] = useState(null);

  const Component = componentName ? components[componentName] : null;

  return (
    <App>
      <Header>
        {Object.keys(components).map((name, idx) => (
          <Button
            key={idx}
            onClick={(e) => {
              setComponentName(name);
              e.preventDefault();
              e.stopPropagation();
            }}
            selected={componentName === name}
          >
            {name}
          </Button>
        ))}
      </Header>
      <Content>{Component && <Component />}</Content>
    </App>
  );
};

const placeholder = document.querySelector('#app');

ReactDOM.render(<Playground />, placeholder);
