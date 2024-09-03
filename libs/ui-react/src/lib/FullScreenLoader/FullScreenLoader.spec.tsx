import { render } from '@testing-library/react';

import FullScreenLoader from './FullScreenLoader';

describe('FullScreenLoader', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FullScreenLoader open />);
    expect(baseElement).toBeTruthy();
  });
});
