import {
  NewSubmissionDocument,
  NewSubmissionRisk,
  RosterExtractorDataInput,
  SubmissionTypeCode,
  UploadableFileType,
} from '@curi-com-services/submission-input-common';

// placeholder, will likely change when we pull from real backend services
export type StandardOption<T = string> = {
  code: T;
  name: string;
};

export type UploadableFile = {
  tempId: string;
  file: File;
  uploadState: UploadState;
  type: UploadableFileType;
  id?: string | null;
  key?: string | null;
  submissionId?: string | null;
};

export enum UploadState {
  Ready = 'READY',
  InProgress = 'IN_PROGRESS',
  Success = 'SUCCESS',
  Error = 'ERROR',
}

export type SubmissionFormData = {
  account: string | null;
  salesforceCaseId: string | null;
  salesforceAccount: {
    id: string | null; // id can be null if it's new
    name: string;
  } | null;
  agency: string | null;
  salesforceAgency: {
    id: string;
    name: string;
  } | null;
  agentProducer: string | null;
  agentSubmitter: string | null;
  salesforceAgentProducer: {
    id: string;
    name: string;
  } | null;
  salesforceAgentSubmitter: {
    id: string;
    name: string;
  } | null;
  claims: string | null;
  expiringPremium: number | null;
  network: string | null;
  brokerCommentsAndPracticeDescription: string | null;
  policyTypes: PolicyCode[] | null;
  stateCodes: StateCode[] | null;
  targetPremium: number | null;
  submissionType: SubmissionTypeCode | null;
  targetEffectiveDate: Date | null;
  desiredIndicationReturnDate: Date | null;
  roster: NewSubmissionRisk[] | null;
  rosterFile: UploadableFile | null;
  additionalDocuments: UploadableFile[] | null;
  pulledDocuments: NewSubmissionDocument[] | null;
  autoApprove: boolean;
  rosterExtractorData: RosterExtractorDataInput | null;
};

export type SimpleDialogProps = {
  open: boolean;
  onClose?: () => void;
};
