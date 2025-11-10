import { render } from '@testing-library/react';

import { DashboardNav } from './DashboardNav';

describe('DashboardNav', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <DashboardNav items={[]} selected={0} onSelect={() => {}} />
    );
    expect(baseElement).toBeTruthy();
  });
});
