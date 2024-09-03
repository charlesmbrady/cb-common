import {
  StageChangeEvent,
  SubmissionAccess,
  SubmissionDetailsJson,
  SubmissionDocumentJson,
  SubmissionRiskJson,
  RosterExtractorDataJson,
  SubmissionStage,
} from '@curi-com-services/submission-input-common';
import { SwapDatesWithStrings } from '@curi-com-services/data';

export const SUBMISSION_ID_PREFIX = 'SUB';
export const SUBMISSION_PK_PREFIX = 'SUB';
export const SUBMISSION_DETAILS_SK_PREFIX = 'SUB';
export const SUBMISSION_ACCESS_SK_PREFIX = 'SUB_ACCESS';
export const SUBMISSION_RISK_SK_PREFIX = 'SUB_RISK';
export const SUBMISSION_DOCUMENT_SK_PREFIX = 'SUB_DOCUMENT';
export const ROSTER_EXTRACTOR_DATA_PK = 'REX_DATA';

type SubmissionId = string;
type BrokerageId = string;
type BrokerId = string;

export type SubmissionPk = `${typeof SUBMISSION_PK_PREFIX}#${SubmissionId}`;
export type SubmissionDetailsSk = `${typeof SUBMISSION_DETAILS_SK_PREFIX}#${SubmissionId}`;
export type SubmissionAccessSk =
  `${typeof SUBMISSION_ACCESS_SK_PREFIX}#${SubmissionAccess['accessIdType']}#${SubmissionAccess['accessId']}`;
export type SubmissionRiskSk = `${typeof SUBMISSION_RISK_SK_PREFIX}#${string}`;
export type SubmissionDocumentSk = `${typeof SUBMISSION_DOCUMENT_SK_PREFIX}#${string}`;

export type RosterExtractorDataPk = typeof ROSTER_EXTRACTOR_DATA_PK;
export type RosterExtractorDataSk = `${BrokerageId}#${BrokerId}#${SubmissionId}`;

export type SubmissionDetailsDatabaseItemExternalStage = SubmissionStage.Open | SubmissionStage.Closed;

export type SubmissionDetailsDatabaseItem = SubmissionDetailsJson & {
  pk: SubmissionPk;
  sk: SubmissionDetailsSk;
  stageSk: SubmissionDetailsDatabaseItemStageSk; // used as sort key for list views
};

export type SubmissionDetailsDatabaseItemStageSk = `${SubmissionStage}#${string}`;
export type SubmissionAccessDatabaseItemStageSk =
  | `${SubmissionStage.Open}#${string}`
  | `${SubmissionStage.Closed}#${string}`;

export type SubmissionAccessDatabaseItem = {
  pk: SubmissionPk;
  sk: SubmissionAccessSk;
  stageSk: SubmissionAccessDatabaseItemStageSk;
};

export type SubmissionRiskDatabaseItem = SubmissionRiskJson & {
  pk: SubmissionPk;
  sk: SubmissionRiskSk;
};

export type SubmissionDocumentDatabaseItem = SubmissionDocumentJson & {
  pk: SubmissionPk;
  sk: SubmissionDocumentSk;
};

export type RosterExtractorDataDatabaseItem = RosterExtractorDataJson & {
  pk: RosterExtractorDataPk;
  sk: RosterExtractorDataSk;
  stage: 'PENDING';
};

export type StageChangeEventJson = SwapDatesWithStrings<StageChangeEvent>;
export type StageChangeEventDatabaseItem = StageChangeEventJson;

export type DatabaseQueryParameters = {
  filterExpression?: string;
  limit?: number;
  exclusiveStartKey?: Record<string, unknown>;
};
