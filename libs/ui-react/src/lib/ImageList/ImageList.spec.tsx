import { render } from '@testing-library/react';

import ImageList from './ImageList';

describe('ImageList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ImageList />);
    expect(baseElement).toBeTruthy();
  });
});
