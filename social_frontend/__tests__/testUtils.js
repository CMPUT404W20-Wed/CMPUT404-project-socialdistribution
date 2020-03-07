import React from 'react';
import { unmountComponentAtNode, render } from 'react-dom';
import { StaticRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';


/* Utilities to set up a test environment. */

export function setup(subjectName, location = '/') {
  let rootElement = null;

  const TestWrapper = ({ subject }) => (
    <StaticRouter location={location}>
      {subject}
    </StaticRouter>
  );

  beforeEach(() => {
    rootElement = document.createElement('div');
    document.body.appendChild(rootElement);
  });

  afterEach(() => {
    unmountComponentAtNode(rootElement);
    rootElement.remove();
    rootElement = null;
  });

  return function domTest(description, node, callback) {
    test(`${subjectName}: ${description}`, () => {
      act(() => {
        render(<TestWrapper subject={node} />, rootElement);
      });

      callback(document.querySelector.bind(document));
    });
  };
}
