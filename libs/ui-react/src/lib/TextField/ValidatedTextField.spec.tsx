import { render } from '@testing-library/react';
import { useForm } from 'react-hook-form';

import ValidatedTextField from './ValidatedTextField';

describe('ValidatedTextField', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TestForm />);
    expect(baseElement).toBeTruthy();
  });
});

function TestForm() {
  const { handleSubmit, control } = useForm();
  const onSubmit = (data: unknown) => console.log('onSubmit', data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ValidatedTextField name="test" control={control} />
    </form>
  );
}
