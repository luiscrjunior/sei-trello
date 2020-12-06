import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom';

import components from './components';

if (module.hot) module.hot.accept();

import { App, Header, Content, Button } from './styles';

const Playground = () => {
  const [componentName, setComponentName] = useState(null);

  const renderComponent = useCallback(() => {
    if (!componentName) return null;
    const Component = components[componentName];
    return <Component />;
  }, [componentName]);

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
      <Content>{renderComponent()}</Content>
    </App>
  );
};

const placeholder = document.querySelector('#app');

ReactDOM.render(<Playground />, placeholder);
