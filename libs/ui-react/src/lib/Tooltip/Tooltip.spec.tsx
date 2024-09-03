import { render } from '@testing-library/react';

import Tooltip from './Tooltip';

describe('Tooltip', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <Tooltip title="hello world">
        <span>Content</span>
      </Tooltip>
    );
    expect(baseElement).toBeTruthy();
  });
});
