import { render } from '@testing-library/react';

import AppBar from './AppBar';
import React from 'react';

describe('AppBar', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AppBar />);
    expect(baseElement).toBeTruthy();
  });
});
