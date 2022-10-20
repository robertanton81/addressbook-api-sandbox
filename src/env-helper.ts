import { existsSync } from 'fs';
import { resolve } from 'path';

export function getEnvPath(): string {
  const dest = `${process.cwd()}/src/common/envs/`;
  const env: string | undefined = process.env.NODE_ENV;
  const fallback: string = resolve(`${dest}/.env`);
  const filename: string = env ? `.env.${env}` : '.env';
  let filePath: string = resolve(`${dest}/${filename}`);

  if (!existsSync(filePath)) {
    filePath = fallback;
  }

  return filePath;
}
