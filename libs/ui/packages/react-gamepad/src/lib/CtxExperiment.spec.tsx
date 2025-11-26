import { render } from '@testing-library/react';

import CtxExperiment from './CtxExperiment';

describe('CtxExperiment', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CtxExperiment />);
    expect(baseElement).toBeTruthy();
  });
});
