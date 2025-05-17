import { render } from '@testing-library/react';

import MatterExperiment from './MatterExperiment';

describe('MatterExperiment', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MatterExperiment />);
    expect(baseElement).toBeTruthy();
  });
});
