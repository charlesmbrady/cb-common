import { render } from '@testing-library/react';

import DataSection from './DataSection';

describe('DataSection', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <DataSection
        title="test"
        items={[
          { label: 'item 0', value: '0' },
          { label: 'item 1', value: '2' },
        ]}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
