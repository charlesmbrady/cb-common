import {
  Scenario,
  firstNames,
  lastNames,
  titles,
  cities,
  states,
  industries,
  leadSources,
  leadStatuses,
  streetNames,
  streetDesignators,
  opportunityStages,
  opportunityTypes,
  forecastCategories,
  accountTypes,
  countries,
  descriptors,
} from '@cb-common/mockdat-svc';

// Utility for colored logs (only in local/dev)
const isLocal =
  process.env.NODE_ENV === 'development' || process.env.LOCAL_SERVER === 'true';
const color = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  fgGreen: '\x1b[32m',
  fgBlue: '\x1b[34m',
  fgRed: '\x1b[31m',
  fgYellow: '\x1b[33m',
};
function logLocal(msg, emoji = '', clr = color.reset) {
  if (isLocal) {
    // eslint-disable-next-line no-console
    console.log(`${clr}${emoji} ${msg}${color.reset}`);
  }
}

function randomFrom(arr: any, context?: string): any {
  if (!Array.isArray(arr)) {
    logLocal(
      `randomFrom called with non-array: ${arr} Context: ${context}`,
      '❌',
      color.fgRed
    );
    throw new Error(`randomFrom called with non-array (context: ${context})`);
  }
  if (arr.length === 0) {
    logLocal(
      `randomFrom called with empty array. Context: ${context}`,
      '❌',
      color.fgRed
    );
    throw new Error(`randomFrom called with empty array (context: ${context})`);
  }
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPhoneNumber() {
  const area = Math.floor(200 + Math.random() * 800);
  const mid = Math.floor(100 + Math.random() * 900);
  const last = Math.floor(1000 + Math.random() * 9000);
  return `${area}-${mid}-${last}`;
}

function randomStreet() {
  return `${Math.floor(Math.random() * 9999) + 1} ${randomFrom(
    streetNames,
    'streetNames'
  )} ${randomFrom(streetDesignators, 'streetDesignators')}`;
}

function randomAccountName() {
  return `${randomFrom(descriptors.first, 'descriptors.first')} ${randomFrom(
    descriptors.second,
    'descriptors.second'
  )} ${randomFrom(descriptors.third, 'descriptors.third')}`;
}

export function processScenarioData(
  processScenarioRequest: Scenario
): Array<any> {
  const { data } = processScenarioRequest;
  const { mainObjectType, totalRecords, fieldsData } = data;

  logLocal(
    `Received scenario for type: ${mainObjectType} with ${totalRecords} records and fields: [${fieldsData
      .map((f) => f.type)
      .join(', ')}]`,
    '📥',
    color.fgGreen
  );

  const mockData = [];
  for (let i = 0; i < totalRecords; i++) {
    const record: any = {};
    let firstName: string = randomFrom(firstNames, 'firstNames');
    let lastName: string = randomFrom(lastNames, 'lastNames');
    fieldsData.forEach((field) => {
      const type = field.type.toLowerCase();
      if (type.includes('account') || type.includes('company')) {
        record[field.type] = randomAccountName();
      } else if (type.includes('first name')) {
        firstName = randomFrom(firstNames, 'firstNames');
        record[field.type] = firstName;
      } else if (type.includes('last name')) {
        lastName = randomFrom(lastNames, 'lastNames');
        record[field.type] = lastName;
      } else if (type.includes('email')) {
        record[field.type] = `${String(firstName).toLowerCase()}.${String(
          lastName
        ).toLowerCase()}@email.com`;
      } else if (type.includes('title')) {
        record[field.type] = randomFrom(titles, 'titles');
      } else if (type.includes('city')) {
        record[field.type] = randomFrom(cities, 'cities');
      } else if (type.includes('state')) {
        record[field.type] = randomFrom(states, 'states');
      } else if (type.includes('street')) {
        record[field.type] = randomStreet();
      } else if (type.includes('phone')) {
        record[field.type] = randomPhoneNumber();
      } else if (type.includes('lead source')) {
        record[field.type] = randomFrom(leadSources, 'leadSources');
      } else if (type.includes('lead status')) {
        record[field.type] = randomFrom(leadStatuses, 'leadStatuses');
      } else if (type.includes('industry')) {
        record[field.type] = randomFrom(industries, 'industries');
      } else if (type.includes('opportunity stage')) {
        record[field.type] = randomFrom(opportunityStages, 'opportunityStages');
      } else if (type.includes('forecast category')) {
        record[field.type] = randomFrom(
          forecastCategories,
          'forecastCategories'
        );
      } else if (type.includes('close date')) {
        const today = new Date();
        const daysToAdd = Math.floor(Math.random() * 90) + 1;
        const closeDate = new Date(
          today.getTime() + daysToAdd * 24 * 60 * 60 * 1000
        );
        record[field.type] = closeDate.toISOString().split('T')[0];
      } else if (type.includes('probability')) {
        const prob = Math.floor(Math.random() * 91) + 10;
        record[field.type] = `${prob}%`;
      } else if (type.includes('amount')) {
        const amount = Math.floor(Math.random() * 10000) + 100;
        record[field.type] = `$${amount.toLocaleString()}`;
      } else if (type.includes('number') || type.includes('count')) {
        record[field.type] = Math.floor(Math.random() * 10000);
      } else {
        record[field.type] = generateRandomString();
      }
    });
    mockData.push(record);
  }

  logLocal(
    `Generated ${mockData.length} mock records for type: ${mainObjectType}`,
    '🛠️',
    color.fgBlue
  );

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
