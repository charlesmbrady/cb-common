import { render } from '@testing-library/react';

import ControllerButton from './ControllerButton';

describe('ControllerButton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ControllerButton />);
    expect(baseElement).toBeTruthy();
  });
});
