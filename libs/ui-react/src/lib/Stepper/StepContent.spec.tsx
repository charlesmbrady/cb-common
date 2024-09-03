import { render } from '@testing-library/react';

import StepContent from './StepContent';
import Stepper from './Stepper';

describe('StepContent', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <Stepper orientation="vertical">
        <StepContent />
      </Stepper>
    );
    expect(baseElement).toBeTruthy();
  });
});
