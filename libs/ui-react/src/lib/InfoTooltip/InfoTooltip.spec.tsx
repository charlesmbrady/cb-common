import { render } from '@testing-library/react';

import InfoTooltip from './InfoTooltip';

describe('InfoTooltip', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<InfoTooltip title="test" />);
    expect(baseElement).toBeTruthy();
  });
});
