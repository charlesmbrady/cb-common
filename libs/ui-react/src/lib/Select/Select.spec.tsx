import { render } from '@testing-library/react';

import Select from './Select';

describe('Select', () => {
  it('should render successfully', () => {
    const options = [{ value: 0, label: 'Zero' }];
    const { baseElement } = render(<Select value={0} options={options} />);
    expect(baseElement).toBeTruthy();
  });
});
