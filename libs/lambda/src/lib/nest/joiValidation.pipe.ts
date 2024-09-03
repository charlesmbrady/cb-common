import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, Logger } from '@nestjs/common';
import { NumberSchema, ObjectSchema, Schema, StringSchema } from 'joi';

@Injectable()
export class JoiValidationPipe<T> implements PipeTransform {
  constructor(private schema: ObjectSchema | StringSchema | NumberSchema | Schema<T>) {}

  transform<T>(value: T, metadata: ArgumentMetadata) {
    const { error, value: transformedValue } = this.schema.validate(value);

    if (error) {
      const errorMessages = error.details.map((d) => d.message).join();
      Logger.error('Validation failed', { value, transformedValue, metadata, errorMessages });
      throw new BadRequestException(errorMessages);
    }

    return transformedValue;
  }
}
