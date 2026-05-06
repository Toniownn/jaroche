import 'dotenv/config';
import { buildApp } from './app';
import { env } from './config/env';

const app = buildApp();

app.listen(env.PORT, () => {
  console.log(`[jaroche/server] listening on http://localhost:${env.PORT}`);
});
