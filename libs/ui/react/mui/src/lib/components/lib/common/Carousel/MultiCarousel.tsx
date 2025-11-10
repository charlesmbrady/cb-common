// Documentation here: https://www.npmjs.com/package/react-multi-carousel

import Carousel from 'react-multi-carousel';

// Stable default so we don't recreate the object every render
export const defaultResponsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 10,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 6,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 4,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 3,
  },
} as const;

export type MultiCarouselProps = {
  children: React.ReactNode;
  responsive?: any; // matches react-multi-carousel's expected shape
} & Record<string, any>;

export function MultiCarousel({
  children,
  responsive = defaultResponsive,
  ...props
}: MultiCarouselProps) {
  // Important: forward both responsive and children
  return (
    <Carousel responsive={responsive} {...props}>
      {children}
    </Carousel>
  );
}
