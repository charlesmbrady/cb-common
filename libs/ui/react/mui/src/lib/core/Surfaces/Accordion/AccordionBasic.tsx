import { AccordionItem, AccordionItemProps } from './AccordionItem';

export type AccordionBasicProps = {
  items: AccordionItemProps[];
};

export const AccordionBasic = ({ items }: AccordionBasicProps) => {
  return (
    <>
      {items.map(({ title, description }, index) => (
        <AccordionItem index={index} title={title} description={description} />
      ))}
    </>
  );
};
