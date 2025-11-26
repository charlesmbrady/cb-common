import type { Meta, StoryFn } from '@storybook/react';
import { MultiCarousel } from './MultiCarousel';
import 'react-multi-carousel/lib/styles.css';

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const meta: Meta<typeof MultiCarousel> = {
  component: MultiCarousel,
  title: 'Components/MultiCarousel',
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

export const MultiCarouselBasic: StoryFn = () => {
  return (
    <MultiCarousel autoPlay={true} autoPlaySpeed={800} responsive={responsive}>
      <div style={{ backgroundColor: '#add8e6', height: '200px' }}>
        <img src="https://picsum.photos/200/300" alt="Item 1" />
      </div>
      <div style={{ backgroundColor: '#add8e6', height: '200px' }}>
        <img src="https://picsum.photos/200/300" alt="Item 2" />
      </div>
      <div style={{ backgroundColor: '#90ee90', height: '200px' }}>
        <img src="https://picsum.photos/200/300" alt="Item 3" />
      </div>
      <div style={{ backgroundColor: '#ffffe0', height: '200px' }}>
        <img src="https://picsum.photos/200/300" alt="Item 4" />
      </div>
      <div style={{ backgroundColor: '#dda0dd', height: '200px' }}>
        <img src="https://picsum.photos/200/300" alt="Item 5" />
      </div>
      <div style={{ backgroundColor: '#ffb6c1', height: '200px' }}>
        <img src="https://picsum.photos/200/300" alt="Item 6" />
      </div>
    </MultiCarousel>
  );
};
