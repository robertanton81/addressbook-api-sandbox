import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

export const validateConfig = <T>(
  config: Record<string, unknown>,
  environmentVariables: ClassConstructor<T>,
) => {
  const validatedConfig: Record<string, any> = plainToInstance(
    environmentVariables,
    config,
    {
      enableImplicitConversion: true,
    },
  );

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
};
