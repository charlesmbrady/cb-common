// Shared types and constants for mockdat (used by both backend and frontend)

export type Scenario = {
  id: string;
  name: string;
  description?: string;
  userId: string;
  status: string;
  type: string; // Should be an enum of the main object types in the system
  data: {
    mainObjectType: string;
    totalRecords: number;
    fieldsData: [
      {
        type: string; // Should be an enum of the field types available in the system
        numberOfRecords?: number;
        fieldOptions?: string[];
      }
    ];
  };
};

export type GeneralResponse = {
  status: string;
  message: string;
  data?: any;
  error?: any;
};

export const objectTypes = [
  'Account',
  'Contact',
  'Lead',
  // 'Opportunity',
];

export const fields = [
  'Account Name',
  'City',
  'State',
  'Street',
  'Phone Number',
  'First Name',
  'Last Name',
  'Email',
  'Title',
  'Lead Source',
  'Lead Status',
  'Opportunity Stage',
  'Close Date',
  'Amount',
  'Probability',
  'Forecast Category',
];
