# mockdat-svc

This library provides shared mock data assets and types for use in both backend and frontend applications in the CB Common monorepo. It is used to generate realistic mock data for various record types (Account, Contact, Lead, Opportunity, Generic).

## 📋 Available Fields

The following fields are available for mock data generation. These can be selected in the UI wizard and are supported by the backend data generator:

| Field Name        | Description                                |
| ----------------- | ------------------------------------------ |
| Account Name      | Randomly generated company or account name |
| City              | US city name                               |
| State             | US state name                              |
| Street            | Realistic street address                   |
| Phone Number      | US-format phone number                     |
| First Name        | Person's first name                        |
| Last Name         | Person's last name                         |
| Email             | Email address (first.last@email.com)       |
| Title             | Job title                                  |
| Lead Source       | Source of the lead (e.g., Web, Referral)   |
| Lead Status       | Status of the lead (e.g., New, Working)    |
| Opportunity Stage | Sales pipeline stage                       |
| Close Date        | Date within the next 90 days               |
| Amount            | Currency value (formatted as $X,XXX)       |
| Probability       | Probability percentage (formatted as XX%)  |
| Forecast Category | Sales forecast category                    |

These fields are exported from the library and can be used in both backend and frontend code. The `fields` array in `types.ts` provides the canonical list.

## Building

Run `nx build mockdat-svc` to build the library.

## Running unit tests

Run `nx test mockdat-svc` to execute the unit tests via [Jest](https://jestjs.io).
