import { MikroORM } from '@mikro-orm/core';
import { DatabaseConnectionException } from '../common/exceptions/database-connection.exception';

export const configureDb = async (app, logger) => {
  try {
    await app.get(MikroORM).getSchemaGenerator().ensureDatabase();
    await app.get(MikroORM).getMigrator().up();
  } catch (e) {
    const connErr = new DatabaseConnectionException();
    logger.error(`errCode: ${e.errno} ${connErr.message}`);
  }
};
