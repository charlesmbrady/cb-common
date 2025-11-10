import { basePreview } from './basepreview';
import { muiDecorator } from './mui-decorator';

export default {
  ...basePreview,
  decorators: [
    ...(Array.isArray(basePreview.decorators)
      ? basePreview.decorators
      : basePreview.decorators
      ? [basePreview.decorators]
      : []),
    muiDecorator,
  ],
};
