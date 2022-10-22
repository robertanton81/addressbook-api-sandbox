import transformer from '@nestjs/swagger/plugin';

export const name = 'nestjs-swagger-transformer';
export const version = 1;

export const factory = (cs) => {
  return transformer.before({}, cs.program);
};
