import crypto from 'crypto';
import { Ora } from 'ora';
import { Sade } from 'sade';

import readline from 'readline';
import { jsonFetch } from '../jsonFetch';

type Auth = {
    user_id: number
    access_token: string
    refresh_token: string
    expires_in: number
}

function check(state: string): Promise<Auth | undefined> {
    return jsonFetch<Auth>(`http://127.0.0.1:3000/api/check/${state}`).then((response) => response.data).catch(() => undefined);
}

export const addLogin = (prog: Sade, spinner: Ora) => prog
    .command('login')
    .describe('Login to Figma.')
    .example('login')
    .action(
        () => {
            const state = crypto.createHash('md5').update(Math.random().toString()).digest('hex');
            spinner.info('Log in on https://figma.com');
            console.log(`
Login at:
http://127.0.0.1:3000/api/login/${state}
          `);

            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });

            rl.question('PIN: ', (pin) => {
                check(`${state}:${pin}`).then((response) => {
                    if (response == null) {
                        spinner.fail('Failed to login!');
                        return;
                    }

                    spinner.info(JSON.stringify(response, undefined, 2));
                    spinner.succeed('Logged in on https://figma.com.');
                }).catch((error) => {
                    spinner.fail(error);
                });
                rl.close();
            });

            // spinner.start('waiting');

            // check(state).then((response) => {
            //     spinner.info(JSON.stringify(response, undefined, 2));
            //     spinner.succeed('Logged in on https://figma.com.');
            // });
        },
    );
