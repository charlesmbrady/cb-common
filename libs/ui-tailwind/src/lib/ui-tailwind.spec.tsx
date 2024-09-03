import { render } from '@testing-library/react';

import UiTailwind from './ui-tailwind';

describe('UiTailwind', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UiTailwind />);
    expect(baseElement).toBeTruthy();
  });
});
