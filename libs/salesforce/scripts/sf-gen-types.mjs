import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import assert from 'assert';
import axios from 'axios';
import jsforce from 'jsforce';
import jwt from 'jsonwebtoken';
import path from 'path';
import qs from 'qs';

assert(process.env.SALESFORCE_CERT_KEY, 'Missing SALESFORCE_CERT_KEY environment variable');
assert(process.env.SALESFORCE_LOGIN_SUBJECT, 'Missing SALESFORCE_LOGIN_SUBJECT environment variable');
assert(process.env.SALESFORCE_LOGIN_DOMAIN, 'Missing SALESFORCE_LOGIN_DOMAIN environment variable');
assert(process.env.SALESFORCE_CLIENT_ID, 'Missing SALESFORCE_CLIENT_ID environment variable');

const config = {
  certKey: process.env.SALESFORCE_CERT_KEY,
  subject: process.env.SALESFORCE_LOGIN_SUBJECT,
  loginDomain: process.env.SALESFORCE_LOGIN_DOMAIN,
  clientId: process.env.SALESFORCE_CLIENT_ID,
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.resolve(__dirname, '../src/lib/generated');
console.log(`Writing to: ${distPath}`);

const typesToGenerate = [
  { resource: 'Account', label: 'Account' },
  { resource: 'AccountContactRelation', label: 'AccountContactRelation' },
  { resource: 'Case', label: 'Case' },
  { resource: 'Opportunity', label: 'Opportunity' },
  { resource: 'Policy__c', label: 'Policy' },
  { resource: 'Contact', label: 'Contact' },
  { resource: 'RecordType', label: 'RecordType' },
  { resource: 'Task', label: 'Task' },
  { resource: 'User', label: 'User' },
  { resource: 'ContentDocument', label: 'ContentDocument' },
  { resource: 'EmailMessage', label: 'EmailMessage' },
  { resource: 'Employee__c', label: 'Employee' },
];

const ignoreFieldPrefixes = ['zz', 'gweb', 'et4ae5', 'dupcheck'];

async function getConnection() {
  const token = jwt.sign({}, config.certKey, {
    algorithm: 'RS256',
    subject: config.subject,
    audience: config.loginDomain,
    issuer: config.clientId,
    expiresIn: '2 minutes',
  });

  const params = {
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion: token,
  };

  const res = await axios.post(`${config.loginDomain}/services/oauth2/token`, qs.stringify(params));
  return new jsforce.Connection({
    instanceUrl: res.data.instance_url,
    accessToken: res.data.access_token,
  });
}

function generateResourceType() {
  return `export enum SalesforceResource {
${typesToGenerate.map((t) => `  ${t.label} = '${t.resource}',`).join('\n')}
}\n`;
}

function generateObjectTypes() {
  return `
export type SalesforceObject = ${typesToGenerate.map((t) => `${t.resource}.Salesforce${t.label}`).join(' | ')};

export type AppObject = ${typesToGenerate.map((t) => `${t.resource}.App${t.label}`).join(' | ')};

export type CreateSalesforceObjectInput = ${typesToGenerate
    .map((t) => `${t.resource}.CreateSalesforce${t.label}Input`)
    .join(' | ')}
`;
}

function generateTypes(label, sfObjectDescription) {
  const fields = buildFields(sfObjectDescription);

  const salesforceInterface = `Salesforce${label}`;
  const appInterface = `App${label}`;

  const readonlyFields = fields.filter((field) => !field.updateable);

  const types = `
export interface ${salesforceInterface} {
${fields.map((field) => `  ${field.salesforceName}${field.nillable ? '?' : ''}: ${field.salesforceType};`).join('\n')}
}

export type Create${salesforceInterface}Input = Omit<${salesforceInterface}, ${readonlyFields
    .map((f) => `'${f.salesforceName}'`)
    .join(' | ')}>;

export interface ${appInterface} {
${fields.map((field) => `  ${field.appName}${field.nillable ? '?' : ''}: ${field.appType};`).join('\n')}
}

export type Create${appInterface}Input = Omit<${appInterface}, ${readonlyFields
    .map((f) => `'${f.appName}'`)
    .join(' | ')}>;
`;

  const mappingFunctions = `
export function ${lowercaseFirstLetter(label)}ToSalesforce(data: ${appInterface}): ${salesforceInterface} {
  return {
${fields.map((field) => `    ${generateToSalesforce(field)},`).join('\n')}
  };
}

export function new${label}ToSalesforce(data: Create${appInterface}Input): Create${salesforceInterface}Input {
  return {
${fields
  .filter((field) => field.updateable)
  .map((field) => `    ${generateToSalesforce(field)},`)
  .join('\n')}
  };
}

export function ${lowercaseFirstLetter(label)}FromSalesforce(data: ${salesforceInterface}): ${appInterface} {
  return {
${fields.map((field) => `    ${generateFromSalesforce(field)},`).join('\n')}
  };
}
`;

  return {
    types,
    mappingFunctions,
  };
}

// stringify Dates and arrays
function generateToSalesforce(field) {
  if (field.needsArrayTranslation) {
    return `${field.salesforceName}: Array.isArray(data.${field.appName}) ? data.${field.appName}.join(';') : ${
      field.nillable ? 'undefined' : ''
    }`;
  }

  if (field.needsDateTranslation) {
    return `${field.salesforceName}: typeof data.${field.appName}?.toISOString === 'function' ? data.${
      field.appName
    }.toISOString() : ${field.nillable ? 'undefined' : '(new Date()).toISOString()'}`;
  }

  return `${field.salesforceName}: data.${field.appName}`;
}

// stringify Dates and arrays
function generateFromSalesforce(field) {
  if (field.needsArrayTranslation) {
    return `${field.appName}: typeof data.${field.salesforceName} === 'string' ? data.${
      field.salesforceName
    }.split(';').filter(v => Boolean(v)) : ${field.nillable ? 'undefined' : '[]'}`;
  }

  if (field.needsDateTranslation) {
    return `${field.appName}: typeof data.${field.salesforceName} === 'string' ? new Date(data.${
      field.salesforceName
    }) : ${field.nillable ? 'undefined' : 'new Date()'}`;
  }

  return `${field.appName}: data.${field.salesforceName}`;
}

function buildFields(sfObjectDescription) {
  // run through the fields and generate both salesforce and app types
  // generate mapping function per property
  // mapping is mostly one-to-one, picklists will be split on ';', dates will be new Date()

  const fields = sfObjectDescription.fields.filter((f) => !ignoreFieldPrefixes.some((p) => f.name.startsWith(p)));
  fields.sort((a, b) => a.name.localeCompare(b.name));

  return fields.map((field) => ({
    // Note: setting nillable here will add the `?` as appropriate, but the salesforce type and app type won't append `| null`
    // This is correct, since the field is required, but will set a default value if not provided
    // `null` would not be a valid value
    nillable: field.nillable || field.defaultValue !== null,
    updateable: field.updateable,
    label: field.label,
    needsArrayTranslation: field.type === 'multipicklist',
    // issue here, we really only want to translate the date if it's a datetime. don't want to turn non-tz dates into javascript dates
    needsDateTranslation: field.type === 'date' || field.type === 'datetime',
    salesforceName: field.name,
    salesforceType: getSalesforceType(field),
    // for now, don't translate prop names
    // appName: normalizeSalesforceName(field.name),
    appName: field.name,
    appType: getAppType(field),
  }));
}

function getSalesforceType(field) {
  let type;
  switch (field.type) {
    case 'double':
      type = 'number';
      break;
    case 'boolean':
      type = 'boolean';
      break;
    case 'picklist':
      type = `${field.picklistValues.map((pv) => `'${pv.value.replace(/'/g, "\\'")}'`).join(' | ')}`;
      break;
    case 'multipicklist': // can't provide better typing, it's a semicolon-delimited string that we'll split to an array
    case 'currency':
    case 'date':
    case 'datetime':
    case 'id':
    case 'reference':
    case 'string':
    case 'textarea':
    default:
      type = 'string';
      break;
  }

  return field.nillable ? `${type} | null` : type;
}

function getAppType(field) {
  let type;
  switch (field.type) {
    case 'double':
      type = 'number';
      break;
    case 'boolean':
      type = 'boolean';
      break;
    case 'picklist':
      // TODO generate enums
      type = `${field.picklistValues.map((pv) => `'${pv.value.replace(/'/g, "\\'")}'`).join(' | ')}`;
      break;
    case 'multipicklist':
      type = `(${field.picklistValues.map((pv) => `'${pv.value.replace(/'/g, "\\'")}'`).join(' | ')} | string)[]`;
      break;
    case 'date':
    case 'datetime':
      type = 'Date';
      break;
    case 'currency':
    case 'id':
    case 'reference':
    case 'string':
    case 'textarea':
    default:
      type = 'string';
      break;
  }

  return field.nillable ? `${type} | null` : type;
}

// function normalizeSalesforceName(name) {
//   // Master_Policy_Number__c -> masterPolicyNumber
//   return lowercaseFirstLetter(
//     name
//       .replace('__c', '')
//       .split('_')
//       .map((p) => uppercaseFirstLetter(p))
//       .join('')
//   );
// }

// function uppercaseFirstLetter(string) {
//   return string.charAt(0).toUpperCase() + string.slice(1);
// }

function lowercaseFirstLetter(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

function writeIndex() {
  return writeFile(
    'index.ts',
    [
      ...typesToGenerate.map(({ resource }) => `import * as ${resource} from './${resource}';`),
      ...typesToGenerate.map(({ resource }) => `export * from './${resource}';`),
      generateResourceType(),
      generateObjectTypes(),
    ].join('\n')
  );
}

function writeFile(filename, data) {
  const fullFilename = `${distPath}/${filename}`;
  console.log(`Writing to: ${fullFilename}`);
  const content = `// GENERATED FILE, DO NOT EDIT DIRECTLY\n${data}`;
  fs.writeFile(fullFilename, content);
}

(async function start() {
  const connection = await getConnection();

  await Promise.all(
    typesToGenerate.map(async (typeToGenerate) => {
      const describePolicyResp = await connection.describe(typeToGenerate.resource);
      const { types, mappingFunctions } = generateTypes(typeToGenerate.label, describePolicyResp);

      await writeFile(`${typeToGenerate.resource}.ts`, `${types}\n${mappingFunctions}`);
    })
  );

  await writeIndex();
})();
