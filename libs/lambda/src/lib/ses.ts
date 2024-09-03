import { SESv2, SendEmailCommand } from '@aws-sdk/client-sesv2';

import { getLogger, getLogStructForError } from './logger';

const sesClient = new SESv2({ region: 'us-east-1' });
const logger = getLogger();

export async function sendEmail({
  toAddresses,
  subject,
  fromAddress,
  ccAddresses,
  bccAddresses,
  replyToAddresses,
  body,
}: {
  toAddresses: string[];
  bccAddresses?: string[];
  ccAddresses?: string[];
  replyToAddresses?: string[];
  subject: string;
  body: string;
  fromAddress: string;
}): Promise<boolean> {
  const finalReplyToAddresses =
    Array.isArray(replyToAddresses) && replyToAddresses.length ? replyToAddresses : [fromAddress];

  try {
    const sendEmailCommand = new SendEmailCommand({
      Content: {
        Simple: {
          Body: {
            Html: {
              Data: body,
              Charset: 'UTF-8',
            },
          },
          Subject: {
            Data: subject,
            Charset: 'UTF-8',
          },
        },
      },
      Destination: {
        ToAddresses: toAddresses,
        BccAddresses: bccAddresses,
        CcAddresses: ccAddresses,
      },
      FromEmailAddress: fromAddress,
      ReplyToAddresses: finalReplyToAddresses,
    });
    logger.info('Sending email', { sendEmailCommand });
    const sendEmailResponse = await sesClient.send(sendEmailCommand);
    logger.info('Email response', { sendEmailResponse });
    return true;
  } catch (err) {
    logger.error('Failed to send email', { err: getLogStructForError(err) });
    return false;
  }
}
