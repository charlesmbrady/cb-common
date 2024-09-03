import { render } from '@testing-library/react';

import MultiSelect from './MultiSelect';

describe('MultiSelect', () => {
  it('should render successfully', () => {
    const options = [
      { value: 0, label: 'Zero' },
      { value: 1, label: 'One' },
      { value: 2, label: 'Two' },
    ];
    const { baseElement } = render(<MultiSelect value={[]} options={options} />);
    expect(baseElement).toBeTruthy();
  });
});
