import React from 'react';
import { getHelloWorld } from '@github-actions/feature-branch-demo.get-hello-world';

/**
 *  A function component that returns a div with the text "Hello World"
 */

export function HelloWorld() {
  return <h1 style={{ backgroundColor: 'SlateBlue', color: 'white' }}>{getHelloWorld()}</h1>;
}
