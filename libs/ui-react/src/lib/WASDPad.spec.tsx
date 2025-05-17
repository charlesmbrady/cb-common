import { render } from '@testing-library/react';

import WASDPad from './WASDPad';

describe('WASDPad', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<WASDPad />);
    expect(baseElement).toBeTruthy();
  });
});
