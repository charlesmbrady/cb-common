import { render } from '@testing-library/react';

import Jumbotron from './Jumbotron';

describe('Jumbotron', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Jumbotron />);
    expect(baseElement).toBeTruthy();
  });
});
