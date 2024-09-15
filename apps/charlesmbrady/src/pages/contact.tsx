// src/pages/Contact.tsx

import { PageContent } from '../components/PageContent';
import { PageHeader } from '../components/PageHeader';

export default function Contact() {
  return (
    <PageContent>
      <PageHeader
        title={'Get in Touch'}
        description={
          'I’d love to hear from you. Whether you have a question, want to collaborate, or just want to say hi!'
        }
      />
    </PageContent>
  );
}
