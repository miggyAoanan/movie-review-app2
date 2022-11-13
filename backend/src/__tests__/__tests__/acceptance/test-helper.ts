import {
  Client, createRestAppClient,
  givenHttpServerConfig
} from '@loopback/testlab';
import { BackendApplication } from '../../../application'
import { mongodb } from '../fixtures/datasources/mongodb.datasource';

export async function setupApplication(): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({
    // Customize the server configuration here.
    // Empty values (undefined, '') will be ignored by the helper.
    //
    // host: process.env.HOST,
    // port: +process.env.PORT,
  });

  const app = new BackendApplication({
    rest: restConfig,
  });

  await app.boot();

  app.dataSource(mongodb);

  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

export interface AppWithClient {
  app: BackendApplication;
  client: Client;
}
