import * as Joi from 'joi';

export const UUID_PATTERN =
  '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}';

export const JOI_OBJECT_OPTIONS: Joi.ValidationOptions = {
  abortEarly: false,
  stripUnknown: false,
  allowUnknown: true,
} as const;

export const JOI_OASIS_CLIENT_ID = Joi.string().trim().alphanum().length(7);

export const JOI_OASIS_POLICY_ID = Joi.string()
  .trim()
  .regex(/^[a-z0-9]{6,}(-\d\d)?$/i, { name: 'oasisPolicyIdPattern' });

export const JOI_SALESFORCE_ID = Joi.string().trim().alphanum().min(15).max(18);

export const customJoi = Joi.extend(
  // TODO get this default object working
  // (joi) => ({
  //   type: 'object',
  //   base: joi.object().unknown(true).options(JOI_OBJECT_OPTIONS),
  // }),
  (joi) => ({
    type: 'arrayString',
    base: joi.array(),
    coerce: (value) =>
      typeof value.split === 'function'
        ? { value: value.split(',') }
        : { value },
  }),
  (joi) => ({
    type: 'jsonString',
    base: joi
      .object()
      .messages({ SyntaxError: 'failed to parse json from string' }),
    coerce: (value, helpers) => {
      try {
        return { value: JSON.parse(value) };
      } catch (err) {
        return {
          errors: [helpers.error(hasName(err) ? err.name : 'SyntaxError')],
        };
      }
    },
  })
);

function hasName(obj: unknown): obj is {
  name: string;
} {
  return typeof obj === 'object' && obj !== null && 'name' in obj;
}
