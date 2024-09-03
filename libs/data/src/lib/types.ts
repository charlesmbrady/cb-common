import { UserStatusType } from '@aws-sdk/client-cognito-identity-provider';

// TODO figure out a recursive version of this
export type NonNullableKeys<T> = { [K in keyof T]: NonNullable<T[K]> };

export type DeepReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> &
      Partial<Record<Exclude<Keys, K>, undefined>>;
  }[Keys];

// https://stackoverflow.com/questions/65420372/typescript-convert-all-date-from-interface-to-string
export type SwapDatesWithStrings<T> = {
  [k in keyof T]: T[k] extends Date
    ? string
    : T[k] extends Date | null | undefined
    ? string | null | undefined
    : T[k];
};

export type OkResponse = {
  status: 'ok';
};

export enum PolicyCode {
  ClaimsMade = 'CLAIMS_MADE',
  ClaimsMadePlus = 'CLAIMS_MADE_PLUS',
  Occurrence = 'OCCURRENCE',
}

export type PolicyTypeCode = string;
export type PolicyFormCode = string;
export type CoverageCode = string;
export type InsuredTypeCode = string;

export type CountyCode = string;

export type County = {
  code: CountyCode;
  name: string;
};

export type SpecialtyCode = string;

export type Specialty = {
  name: string;
  code: SpecialtyCode;
  isSurgical?: boolean;
};

export type LimitsCode = string;

export type Limits = {
  name: string;
  code: LimitsCode;
};

export type WeeklyHoursCode = number;

export type WeeklyHours = {
  name: string;
  code: WeeklyHoursCode;
};

export enum UserRole {
  AdminViewOnly = 'ROLE_MMIC_ADMIN_VIEW_ONLY',
  AgencyAdmin = 'ROLE_MMIC_AGENCY_ADMIN',
  AgencyProducer = 'ROLE_MMIC_AGENCY_PRODUCER',
  AuthorizedStaff = 'ROLE_MMIC_AUTHORIZED_STAFF',
  CapitalUser = 'ROLE_MMIC_CAPITAL_USER',
  Internal = 'CURI_INTERNAL',
  PortalUser = 'ROLE_MMIC_PORTAL_USER',
  PracticeAdministratorSubordinate = 'ROLE_MMIC_PRACTICE_ADMINISTRATOR_SUBORDINATE',
  PracticeAdministrator = 'ROLE_MMIC_PRACTICE_ADMINISTRATOR',
  PracticeStaff = 'ROLE_MMIC_PRACTICE_STAFF',
  Risk = 'ROLE_MMIC_RISK',
  SiteAdmin = 'ROLE_MMIC_SITE_ADMIN',
  Underwriter = 'ROLE_MMIC_UNDERWRITER',
  UnderwritingAssistant = 'ROLE_MMIC_UNDERWRITING_ASSISTANT',
  UnderwritingManager = 'ROLE_MMIC_UNDERWRITING_MANAGER',
  User = 'ROLE_MMIC_USER',
  FedMyAccount = 'FED_MYACCOUNT',
  FedMyAccountBroker = 'FED_MYACCOUNT_BROKER',
  MPIE = 'MPIE',
}

// lots of optional values because AWS UserType also has them
export type CognitoUser = {
  attributes?: {
    name: string; // TODO determine what the overlap is between these and AuthorizerClaims keys
    value?: string;
  }[];
  enabled?: boolean;
  userCreateDate?: string; // ISO
  userLastModifiedDate?: string; // ISO
  userStatus?: UserStatusType | string;
  username?: string;
};

export type ListUsersParameters = {
  filter?: string;
  limit?: number;
  paginationToken?: string;
};

export type ListUsersResponse = {
  users?: CognitoUser[];
  paginationToken?: string;
};

export interface HealthCheckable {
  healthCheck: (...args: unknown[]) => boolean | Promise<boolean>;
}

export type AuthorizerClaims = {
  at_hash: string;
  lastName: string;
  sub: string;
  'cognito:groups': string;
  roles: string;
  policies: string;
  iss: string;
  phsKey: string;
  'cognito:username': string;
  userId: string;
  origin_jti: string;
  firstName: string;
  aud: string;
  swatUrl: string;
  event_id: string;
  token_use: string;
  auth_time: string;
  showPendingMessage: string;
  exp: string;
  iat: string;
  jti: string;
  email: string;
  'custom:ssoUserId': string;
};

export type Policy = {
  code: PolicyCode;
  name: string;
  policyTypeCode: PolicyTypeCode;
  insuredTypeCode: InsuredTypeCode;
  coverages: {
    policyFormCode: PolicyFormCode;
    coverageCode: CoverageCode;
  }[];
};
