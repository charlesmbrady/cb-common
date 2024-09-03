import { render } from '@testing-library/react';

import Dropzone from './Dropzone';

describe('Dropzone', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Dropzone />);
    expect(baseElement).toBeTruthy();
  });
});
