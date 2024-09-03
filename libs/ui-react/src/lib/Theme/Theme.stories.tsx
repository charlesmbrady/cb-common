import { Box, Typography } from '@mui/material';
import { Story, Meta } from '@storybook/react';

export default {
  component: PaletteStory,
  title: 'Theme',
} as Meta;

function PaletteStory() {
  return (
    <Box>
      <ColorRow label="Primary" prefix="primary" />
      <ColorRow label="Secondary" prefix="secondary" />
      <ColorRow label="Success" prefix="success" />
      <ColorRow label="Info" prefix="info" />
      <ColorRow label="Warning" prefix="warning" />
      <ColorRow label="Error" prefix="error" />
    </Box>
  );
}

function BrandStory() {
  return (
    <Box>
      <ColorRow label="Light Green" prefix="lightGreen" />
      <ColorRow label="MaximumB lue" prefix="maximumBlue" />
      <ColorRow label="Medium Blue" prefix="mediumBlue" />
      <ColorRow label="Navy" prefix="navy" />
      <ColorRow label="Aqua" prefix="aqua" />
      <ColorRow label="Pear" prefix="pear" />
    </Box>
  );
}

function ColorRow({ label, prefix }: { label: string; prefix: string }) {
  return (
    <Box display="inline-block" sx={{ m: 1, mr: 4 }}>
      <Typography variant="h3">{label}</Typography>
      <Box sx={{ ml: -2 }}>
        <ColorBox label="Main" prefix={prefix} darkness="main" />
        <ColorBox label="Light" prefix={prefix} darkness="light" />
        <ColorBox label="Dark" prefix={prefix} darkness="dark" />
      </Box>
    </Box>
  );
}

function ColorBox({
  label,
  prefix,
  darkness,
}: {
  label: string;
  prefix: string;
  darkness: string;
}) {
  return (
    <Box display="inline-block" sx={{ m: 2 }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          width: 100,
          height: 100,
          backgroundColor: `${prefix}.${darkness}`,
          mb: 0.5,
        }}
      >
        <Typography sx={{ color: `${prefix}.contrastText` }}>Text</Typography>
      </Box>
      <Typography>{label}</Typography>
    </Box>
  );
}

const PaletteTemplate: Story = (args) => <PaletteStory {...args} />;
export const Palette = PaletteTemplate.bind({});
Palette.args = {};

const BrandTemplate: Story = (args) => <BrandStory {...args} />;
export const Brand = BrandTemplate.bind({});
Brand.args = {};
