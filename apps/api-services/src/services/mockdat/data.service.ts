import { Scenario } from '../../types';

export const objectTypes = [
  'Account',
  'Contact',
  'Lead',
  // 'Opportunity',
];

export const fields = [
  'Account Name',
  'City',
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

export function processScenarioData(
  processScenarioRequest: Scenario
): Array<any> {
  const { data } = processScenarioRequest;
  const { mainObjectType, totalRecords, fieldsData } = data;

  // Generate mock data based on the scenario
  const mockData = [];
  for (let i = 0; i < totalRecords; i++) {
    const record: any = {};
    fieldsData.forEach((field) => {
      if (field.type === 'string') {
        record[field.type] = generateRandomString();
      } else if (field.type === 'number') {
        record[field.type] = generateRandomNumber();
      }
    });
    mockData.push(record);
  }

  return mockData;
}
function generateRandomString(length: number = 10): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
function generateRandomNumber(min: number = 1, max: number = 100): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
