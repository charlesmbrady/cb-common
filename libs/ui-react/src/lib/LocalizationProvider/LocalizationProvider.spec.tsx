import { render } from '@testing-library/react';

import LocalizationProvider from './LocalizationProvider';

describe('LocalizationProvider', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LocalizationProvider />);
    expect(baseElement).toBeTruthy();
  });
});
