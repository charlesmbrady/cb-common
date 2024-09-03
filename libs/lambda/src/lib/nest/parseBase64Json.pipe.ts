import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, Logger } from '@nestjs/common';
import { getLogStructForError } from '../logger';

@Injectable()
export class ParseBase64JsonPipe implements PipeTransform {
  transform(base64String: string | undefined, metadata: ArgumentMetadata) {
    try {
      if (base64String === undefined) {
        return undefined;
      }

      const value = Buffer.from(base64String, 'base64').toString('utf8');
      return JSON.parse(value);
    } catch (err) {
      Logger.error('Failed to parse base64 json', { metadata, err: getLogStructForError(err) });
      throw new BadRequestException('Failed to parse');
    }
  }
}
