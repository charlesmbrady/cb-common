// libs/shared/ui/src/lib/topic-button/topic-button.stories.tsx
import { StoryObj, Meta } from '@storybook/react';
import { useState } from 'react';
import { TopicButton, TopicButtonProps } from './topic-button';

// export default {
//   component: TopicButton,
//   title: 'TopicButton',
//   argTypes: {
//     onClick: { action: 'onClick executed!' },
//   },
// } as Meta;

// type Story = StoryObj<typeof TopicButton>;

// const Template: Story<TopicButtonProps> = (args: TopicButtonProps) => {
//   const [clickedTopic, setClickedTopic] = useState<string | null>(null);
//   return (
//     <div className="bg-gray-100 p-20">
//       <TopicButton {...args} onClick={(topicName) => setClickedTopic(topicName)} />
//       {clickedTopic && <div>Button has been clicked: {clickedTopic}</div>}
//     </div>
//   );
// };

// export const Primary = Template.bind({});
// Primary.args = {
//   topicName: 'Next.js',
// };

const meta: Meta<typeof TopicButton> = {
  component: TopicButton,
  title: 'TopicButton',
};
export default meta;
type Story = StoryObj<typeof TopicButton>;

export const Primary: Story = {
  args: {
    topicName: 'Next.js',
  },
};

// export const Topic: Story = {
//   args: {},
// };
