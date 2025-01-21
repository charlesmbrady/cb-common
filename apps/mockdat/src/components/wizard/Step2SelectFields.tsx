// components/wizard/Step2SelectFieldsTransferList.tsx
import React, { useContext, useMemo, useState } from 'react';
import { MockdatContext } from '../../context/MockdatContext';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  Checkbox,
  ListItemText,
  Typography,
} from '@mui/material';

const allPossibleFields: Record<any, string[]> = {
  '': [],
  Accounts: [
    'Account Name',
    'Company Name',
    'State',
    'Street',
    'Email',
    'Industry',
    'Employee Count',
  ],
  Contacts: ['First', 'Last', 'Middle', 'State', 'Street', 'Email'],
  Leads: ['Name', 'Company', 'Phone', 'Email', 'Status'],
  Opportunities: ['Name', 'Stage', 'Amount', 'Close Date'],
};

function not(a: string[], b: string[]): string[] {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: string[], b: string[]): string[] {
  return a.filter((value) => b.indexOf(value) !== -1);
}

const Step2SelectFieldsTransferList: React.FC = () => {
  const ctx = useContext(MockdatContext);
  if (!ctx) return null;

  const { recordType, selectedFields, setSelectedFields, step, setStep } = ctx;

  const handleBack = () => setStep(step - 1);
  const handleNext = () => setStep(step + 1);

  // The “left” list is all fields not currently selected.
  const leftFields = useMemo(() => {
    return not(allPossibleFields[recordType] || [], selectedFields);
  }, [recordType, selectedFields]);

  // The “right” list is the already selected fields (from context).
  const rightFields = selectedFields;

  // This is the list of items that are currently checked (in either list).
  const [checked, setChecked] = useState<string[]>([]);

  /** Toggle an item in the 'checked' list */
  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  /** Move all from left to right */
  const handleAllRight = () => {
    // Add all leftFields to selectedFields
    setSelectedFields([...selectedFields, ...leftFields]);
    setChecked(not(checked, leftFields));
  };

  /** Move only checked items from left to right */
  const handleCheckedRight = () => {
    const toMove = intersection(checked, leftFields);
    setSelectedFields([...selectedFields, ...toMove]);
    setChecked(not(checked, toMove));
  };

  /** Move all from right to left */
  const handleAllLeft = () => {
    // Clear out selectedFields
    setSelectedFields([]);
    setChecked(not(checked, rightFields));
  };

  /** Move only checked items from right to left */
  const handleCheckedLeft = () => {
    const toMove = intersection(checked, rightFields);
    setSelectedFields(not(selectedFields, toMove));
    setChecked(not(checked, toMove));
  };

  /** Render a List of items (either left or right) with checkboxes. */
  const customList = (title: React.ReactNode, items: string[]) => (
    <Card sx={{ width: 200, height: 230, overflow: 'auto' }}>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        titleTypographyProps={{ variant: 'subtitle1' }}
        title={title}
      />
      <Divider />
      <List dense component="div" role="list">
        {items.map((value: string) => {
          const labelId = `transfer-list-item-${value}-label`;
          return (
            <ListItem
              key={value}
              dense
              role="listitem"
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Choose which fields to include in your fake data.
      </Typography>

      {/* Transfer List */}
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item>{customList('Available', leftFields)}</Grid>
        <Grid item>
          <Grid container direction="column" alignItems="center">
            <Button
              variant="outlined"
              sx={{ my: 1 }}
              onClick={handleAllRight}
              disabled={leftFields.length === 0}
              aria-label="move all right"
            >
              ≫
            </Button>
            <Button
              variant="outlined"
              sx={{ my: 1 }}
              onClick={handleCheckedRight}
              disabled={intersection(checked, leftFields).length === 0}
              aria-label="move selected right"
            >
              &gt;
            </Button>
            <Button
              variant="outlined"
              sx={{ my: 1 }}
              onClick={handleCheckedLeft}
              disabled={intersection(checked, rightFields).length === 0}
              aria-label="move selected left"
            >
              &lt;
            </Button>
            <Button
              variant="outlined"
              sx={{ my: 1 }}
              onClick={handleAllLeft}
              disabled={rightFields.length === 0}
              aria-label="move all left"
            >
              ≪
            </Button>
          </Grid>
        </Grid>
        <Grid item>{customList('Chosen', rightFields)}</Grid>
      </Grid>

      {/* Buttons: Back / Next */}
      <Box sx={{ mt: 2 }}>
        <Button onClick={handleBack} sx={{ mr: 1 }}>
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={rightFields.length === 0}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default Step2SelectFieldsTransferList;
