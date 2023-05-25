import crypto from 'crypto';
import { Ora } from 'ora';
import { Sade } from 'sade';
import axios from 'axios';

type Auth = {
    user_id: number
    access_token: string
    refresh_token: string
    expires_in: number
}

function check(state: string): Promise<Auth> {
    const result = axios.get<Auth>(`http://localhost:3000/api/check/${state}`).then((response) => {
        return response.data;
    }).catch(() => {
        return new Promise<Auth>((resolve) => {
            setTimeout(() => resolve(check(state)), 2000);
        });
    });

    return result;
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
http://localhost:3000/api/login/${state}
          `);
            spinner.start('waiting');
            check(state).then((response) => {
                spinner.info(response.access_token);
                spinner.succeed('Logged in on https://figma.com.');
            });
        },
    );
