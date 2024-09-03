import { render } from '@testing-library/react';

import ToggleButton from './ToggleButton';

describe('ToggleButton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ToggleButton />);
    expect(baseElement).toBeTruthy();
  });
});
