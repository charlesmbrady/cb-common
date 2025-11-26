import * as React from 'react';
import { FAQContainer } from './FAQContainer';
import { FAQHeader, FAQHeaderProps } from './FAQHeader';
import { FAQList, FAQListProps } from './FAQList';
import { defaultFAQItems } from './faqData';

export type FAQCommonProps = {
  id?: string;
  headerProps?: FAQHeaderProps;
  listProps?: Omit<FAQListProps, 'items'> & { items?: FAQListProps['items'] };
};

export function FAQCommon({
  id = 'faq',
  headerProps,
  listProps,
}: FAQCommonProps) {
  const { items = defaultFAQItems, ...restListProps } = listProps || {};

  return (
    <FAQContainer id={id}>
      <FAQHeader {...headerProps} />
      <FAQList items={items} {...restListProps} />
    </FAQContainer>
  );
}
