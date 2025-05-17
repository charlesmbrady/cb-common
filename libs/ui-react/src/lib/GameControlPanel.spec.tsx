import { render } from '@testing-library/react';

import GameControlPanel from './GameControlPanel';

describe('GameControlPanel', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<GameControlPanel />);
    expect(baseElement).toBeTruthy();
  });
});
