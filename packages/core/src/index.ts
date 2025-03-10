import { env } from 'node:process';
import { ProxyAgent, setGlobalDispatcher } from 'undici';

const proxy =
  env.HTTPS_PROXY ?? env.https_proxy ?? env.HTTP_PROXY ?? env.http_proxy;

if (proxy) {
  // TODO: waiting for https://github.com/nodejs/node/pull/57165 to be released
  setGlobalDispatcher(new ProxyAgent(proxy));
}

export { components } from './lib/export-components.js';
export { styles } from './lib/export-styles.js';
