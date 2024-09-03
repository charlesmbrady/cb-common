import { Fragment } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import Box from '../Box/Box';
import FormLabel from '../FormLabel/FormLabel';
import { generateTestDataAttr } from '../utilities';

export type DataSectionProps = {
  title?: string;
  items: {
    label: string;
    value: string;
  }[];
};

export function DataSection({ title, items }: DataSectionProps) {
  return (
    <Box padding={1}>
      {title && (
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
      )}
      <Grid spacing={1} container component="dl">
        {items.map(({ label, value }, i) => (
          <Fragment key={i}>
            <Grid item xs={12} sm={6} component="dt">
              <FormLabel data-test={generateTestDataAttr('data-label', label)}>{label}</FormLabel>
            </Grid>
            <Grid item xs={12} sm={6} component="dd">
              <Typography data-test={generateTestDataAttr('data-value', label)} fontWeight="bold" component="span">
                {value}
              </Typography>
            </Grid>
          </Fragment>
        ))}
      </Grid>
    </Box>
  );
}

export default DataSection;
