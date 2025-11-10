import { basePreview } from './basePreview';
import { tailwindDecorator } from './tailwind-decorator';
// ✅ Import Tailwind CSS HERE (client context)
import '../styles.css';
export default {
  ...basePreview,
  decorators: [
    ...(Array.isArray(basePreview.decorators) ? basePreview.decorators : []),
    tailwindDecorator,
  ],
};
