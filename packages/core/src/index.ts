import { EnvHttpProxyAgent, setGlobalDispatcher } from 'undici';

// TODO: waiting for https://github.com/nodejs/node/pull/57165 to be released
setupHttpProxy();

function setupHttpProxy(): void {
  if (
    process.env.HTTP_PROXY ||
    process.env.HTTPS_PROXY ||
    process.env.http_proxy ||
    process.env.https_proxy
  ) {
    const envHttpProxyAgent = new EnvHttpProxyAgent();
    setGlobalDispatcher(envHttpProxyAgent);
  }
}

export { components } from './lib/export-components.js';
export { styles } from './lib/export-styles.js';
