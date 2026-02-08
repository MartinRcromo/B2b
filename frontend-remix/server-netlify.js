import { createRequestHandler } from '@netlify/remix-runtime';
import * as build from 'virtual:remix/server-build';

export default createRequestHandler({
  build,
  mode: process.env.NODE_ENV,
});
