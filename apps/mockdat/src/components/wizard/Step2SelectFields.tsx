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
  ListItemButton,
  ListItemIcon,
  Checkbox,
  ListItemText,
} from '@mui/material';
import InstructionsText from '../InstructionsText';
import { not, intersection } from '../../utils/index';

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

// Helper to get all unique fields from all record types
const getAllFields = () => {
  const fieldSets = Object.values(allPossibleFields);
  const allFields = fieldSets.flat();
  return Array.from(new Set(allFields));
};

const Step2SelectFieldsTransferList: React.FC = () => {
  const ctx = useContext(MockdatContext);
  if (!ctx) return null;

  const { recordType, selectedFields, setSelectedFields, step, setStep } = ctx;

  const handleBack = () => setStep(step - 1);
  const handleNext = () => setStep(step + 1);

  // The "left" list is all fields not currently selected.
  const leftFields = useMemo(() => {
    if (recordType === 'Generic') {
      return not(getAllFields(), selectedFields);
    }
    return not(allPossibleFields[recordType] || [], selectedFields);
  }, [recordType, selectedFields]);

  // The "right" list is the already selected fields (from context).
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
    <Card sx={{ overflow: 'scroll' }}>
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
            <ListItemButton
              key={value}
              role="listitem"
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText
                id={labelId}
                primary={value}
                primaryTypographyProps={{ color: 'text.primary' }}
              />
            </ListItemButton>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );

  return (
    <Box
      sx={{
        mb: 2,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        height: '100%',
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          height: 500,
          maxHeight: '60vh',
        }}
      >
        <InstructionsText sx={{ flexShrink: 0, mb: 2 }}>
          Select the fields you want to include in your mock data.
        </InstructionsText>
        <Grid
          container
          spacing={2}
          justifyContent="center"
          sx={{ flex: 1, minHeight: 0 }}
        >
          <Grid
            item
            xs={12}
            sm={5}
            md={4}
            lg={3}
            sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            <Card
              sx={{
                width: 280,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <CardHeader
                title="Available Fields"
                titleTypographyProps={{ color: 'text.primary' }}
                sx={{ flexShrink: 0 }}
              />
              <Divider />
              <Box sx={{ flex: 1, overflow: 'auto' }}>
                <List dense component="div" role="list">
                  {leftFields.map((value) => {
                    const labelId = `transfer-list-item-${value}-label`;
                    return (
                      <ListItemButton
                        key={value}
                        role="listitem"
                        onClick={handleToggle(value)}
                      >
                        <ListItemIcon>
                          <Checkbox
                            checked={checked.indexOf(value) !== -1}
                            tabIndex={-1}
                            disableRipple
                            inputProps={{
                              'aria-labelledby': labelId,
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          id={labelId}
                          primary={value}
                          primaryTypographyProps={{ color: 'text.primary' }}
                        />
                      </ListItemButton>
                    );
                  })}
                  <ListItem />
                </List>
              </Box>
            </Card>
          </Grid>
          <Grid
            item
            xs={12}
            sm={2}
            md={1}
            lg={1}
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{ height: '100%' }}
          >
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleAllRight}
              disabled={leftFields.length === 0}
              aria-label="move all right"
            >
              ≫
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedRight}
              disabled={leftFields.length === 0}
              aria-label="move selected right"
            >
              &gt;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedLeft}
              disabled={rightFields.length === 0}
              aria-label="move selected left"
            >
              &lt;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleAllLeft}
              disabled={rightFields.length === 0}
              aria-label="move all left"
            >
              ≪
            </Button>
          </Grid>
          <Grid
            item
            xs={12}
            sm={5}
            md={4}
            lg={3}
            sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            <Card
              sx={{
                width: 280,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <CardHeader
                title="Selected Fields"
                titleTypographyProps={{ color: 'text.primary' }}
                sx={{ flexShrink: 0 }}
              />
              <Divider />
              <Box sx={{ flex: 1, overflow: 'auto' }}>
                <List dense component="div" role="list">
                  {rightFields.map((value) => {
                    const labelId = `transfer-list-item-${value}-label`;
                    return (
                      <ListItemButton
                        key={value}
                        role="listitem"
                        onClick={handleToggle(value)}
                      >
                        <ListItemIcon>
                          <Checkbox
                            checked={checked.indexOf(value) !== -1}
                            tabIndex={-1}
                            disableRipple
                            inputProps={{
                              'aria-labelledby': labelId,
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          id={labelId}
                          primary={value}
                          primaryTypographyProps={{ color: 'text.primary' }}
                        />
                      </ListItemButton>
                    );
                  })}
                  <ListItem />
                </List>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Step2SelectFieldsTransferList;
