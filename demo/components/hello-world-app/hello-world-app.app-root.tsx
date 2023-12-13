import React from 'react';
import ReactDOM from 'react-dom/client';
/**
 * use the my-org.my-scope/ui/hello-world component.
 * Bit automatically adds it to the dependency graph of this component.
 * to learn more @see https://bit.dev/getting-started/composing/use-dependencies
 */
import { HelloWorld } from '@github-actions/feature-branch-demo.ui.hello-world';

/**
 * A simple app that renders the HelloWorld component.
 */
export const HelloWorldApp = () => {
  return (
    <>
      <HelloWorld />
      <p style={{ backgroundColor: 'Tomato' }}>
        Welcome to the feature branch demo!
      </p>
    </>
  );
};

/*
 * A simple app that renders the HelloWorldApp component.
 */
const root = document!.getElementById('root');
ReactDOM.createRoot(root as HTMLElement).render(<HelloWorldApp />);
