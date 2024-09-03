import {
  CopyObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { Readable } from 'stream';
import { Upload } from '@aws-sdk/lib-storage';
import { customAlphabet } from 'nanoid';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { AuthorizedCognitoUser } from '@curi-com-services/data';
import {
  GetDocumentUrlResponseData,
  SubmissionCreator,
  SubmissionDocument,
} from '@curi-com-services/submission-input-common';
import { getLogStructForError } from '@curi-com-services/lambda';

import { GetDocumentUploadUrlParams } from '../getDocumentUrl.dto';
import { SubmissionDocumentWithUrl } from '../submission/submissionNotificationTypes';

export const WIP_DOCUMENT_PREFIX = 'uploads/wip';
export const SUBMITTED_DOCUMENT_PREFIX = 'uploads/submitted';

const documentNanoId = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 32);

@Injectable()
export class DocumentService {
  private s3Client: S3Client;
  private uploadsBucketName: string;
  private signedUrlExpiresIn: number;
  private signingRegion: string;

  constructor(configService: ConfigService) {
    const region = configService.get<string>('AWS_REGION');
    this.s3Client = new S3Client({ region });
    this.signingRegion = region;
    this.uploadsBucketName = configService.get<string>('SUBMISSION_INPUT_UPLOADS_BUCKET_NAME');
    this.signedUrlExpiresIn = configService.get<number>('SIGNED_URL_EXPIRES_IN');
  }

  isValidWipKey(key: string, user: AuthorizedCognitoUser): boolean {
    const pathRegex = new RegExp(`^${WIP_DOCUMENT_PREFIX}/${user.id}/.+`);
    return pathRegex.test(key);
  }

  isValidSubmittedKey(key: string, submissionId: string): boolean {
    const pathRegex = new RegExp(`^${SUBMITTED_DOCUMENT_PREFIX}/${submissionId}/.+$`);
    return pathRegex.test(key);
  }

  getSubmissionIdFromKey(key: string): string | null {
    const submissionId = key.split('/').reverse()[2];
    return submissionId?.startsWith('SUB') ? submissionId : null;
  }

  async uploadObject(
    stream: Readable,
    params: GetDocumentUploadUrlParams,
    userId: string
  ): Promise<{
    id: string;
    key: string;
  }> {
    const documentId = documentNanoId();

    const key = params.submissionId
      ? `${SUBMITTED_DOCUMENT_PREFIX}/${params.submissionId}/${documentId}/file`
      : `${WIP_DOCUMENT_PREFIX}/${userId}/${documentId}/file`;

    const upload = new Upload({
      client: this.s3Client,
      params: {
        Bucket: this.uploadsBucketName,
        Key: key,
        Body: stream,
        Metadata: {
          ...params,
          id: documentId,
          creator: userId,
        },
      },
    });

    await upload.done();

    return {
      id: documentId,
      key,
    };
  }

  // Builds the "WIP" document key "backwards" from the "Submitted" document
  getWipKeyFromSubmittedDocument(document: SubmissionDocument, creator: SubmissionCreator): string {
    return `${WIP_DOCUMENT_PREFIX}/${creator.userId}/${document.id}/file`;
  }

  async getUploadUrl(
    params: GetDocumentUploadUrlParams,
    user: AuthorizedCognitoUser
  ): Promise<GetDocumentUrlResponseData> {
    // Note: we are not checking permissions here
    // Ensure you are checking that a user has permission to generate this url before using
    const documentId = documentNanoId();
    const key = params.submissionId
      ? `${SUBMITTED_DOCUMENT_PREFIX}/${params.submissionId}/${documentId}/file`
      : `${WIP_DOCUMENT_PREFIX}/${user.id}/${documentId}/file`;

    const command = new PutObjectCommand({
      Bucket: this.uploadsBucketName,
      Key: key,
      Metadata: {
        ...params,
        id: documentId,
        creator: user.id,
      },
    });

    const url = await getSignedUrl(this.s3Client, command, {
      expiresIn: this.signedUrlExpiresIn,
      signingRegion: this.signingRegion,
    });

    return { id: documentId, key, url };
  }

  async getDownloadUrl(submissionIdOrKey: string, documentId?: string): Promise<GetDocumentUrlResponseData> {
    const key = documentId ? `${SUBMITTED_DOCUMENT_PREFIX}/${submissionIdOrKey}/${documentId}/file` : submissionIdOrKey;

    // Note: we are not checking permissions here
    // Ensure you are checking that a user has permission to generate this url before using
    const command = new GetObjectCommand({
      Bucket: this.uploadsBucketName,
      Key: key,
    });

    const url = await getSignedUrl(this.s3Client, command, {
      expiresIn: this.signedUrlExpiresIn,
      signingRegion: this.signingRegion,
    });

    return { id: key.split('/').reverse()[1], key, url };
  }

  async copyWipDocumentsToSubmission(
    documents: SubmissionDocument[],
    submissionId: string
  ): Promise<SubmissionDocument[]> {
    Logger.log('Copying wip documents to submission', { documents, submissionId });
    const copyConfigs = documents.map(({ id, key, name, type, createdDate }) => {
      const [filename] = key.split('/').reverse();
      return {
        id,
        name,
        type,
        createdDate,
        sourceKey: key,
        targetKey: `${SUBMITTED_DOCUMENT_PREFIX}/${submissionId}/${id}/${filename}`,
      };
    });

    const responses = await Promise.all(
      copyConfigs.map((copyConfig) =>
        this.s3Client.send(
          new CopyObjectCommand({
            Bucket: this.uploadsBucketName,
            Key: copyConfig.targetKey,
            CopySource: `${this.uploadsBucketName}/${copyConfig.sourceKey}`,
          })
        )
      )
    );

    Logger.log('Copied wip documents to submission', { responses });
    return copyConfigs.map((copyConfig) => ({
      id: copyConfig.id,
      name: copyConfig.name,
      key: copyConfig.targetKey,
      type: copyConfig.type,
      createdDate: copyConfig.createdDate,
    }));
  }

  async getSubmissionDocumentsWithUrl(document: SubmissionDocument): Promise<SubmissionDocumentWithUrl>;
  async getSubmissionDocumentsWithUrl(documents: SubmissionDocument[]): Promise<SubmissionDocumentWithUrl[]>;
  async getSubmissionDocumentsWithUrl(
    documents: SubmissionDocument | SubmissionDocument[]
  ): Promise<SubmissionDocumentWithUrl | SubmissionDocumentWithUrl[]> {
    if (Array.isArray(documents)) {
      return Promise.all(
        documents.map(async (document) => ({
          ...document,
          url: (await this.getDownloadUrl(document.key)).url,
        }))
      );
    }

    return {
      ...documents,
      url: (await this.getDownloadUrl(documents.key)).url,
    };
  }

  async deleteDocuments(documents: { key: string }[]): Promise<boolean> {
    try {
      if (!documents.length) {
        return true;
      }

      const command = new DeleteObjectsCommand({
        Bucket: this.uploadsBucketName,
        Delete: {
          Objects: documents.map(({ key }) => ({ Key: key })),
        },
      });

      const response = await this.s3Client.send(command);
      Logger.log('Deleted documents', { response });

      response.Errors?.forEach((error) => {
        Logger.error('Failed to delete document', { error });
      });

      return response.Deleted?.length === documents.length;
    } catch (err) {
      Logger.error('Failed to delete documents', { err: getLogStructForError(err) });
      return false;
    }
  }
}

export default DocumentService;
