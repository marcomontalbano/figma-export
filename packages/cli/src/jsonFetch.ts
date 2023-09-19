import http from 'http';
import https from 'https';

type Response<Data> = {
    status?: number
    statusText?: string
    headers: http.IncomingHttpHeaders
    body: string
    data: Data
}

export const jsonFetch = <Data>(url: string): Promise<Response<Data>> => {
    return new Promise((resolve, reject) => {
        // Parse the URL
        const parsedUrl = new URL(url);

        // Determine the protocol module (http or https)
        const protocol = parsedUrl.protocol === 'https:' ? https : http;

        // Prepare the request options
        const options = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port,
            path: parsedUrl.pathname + parsedUrl.search,
            method: 'GET',
        };

        // Send the request
        const req = protocol.request(options, (res) => {
            let body = '';

            // Accumulate the response data
            res.on('data', (chunk) => {
                body += chunk;
            });

            // Resolve the promise when the response ends
            res.on('end', () => {
                try {
                    const data = JSON.parse(body);
                    resolve({
                        status: res.statusCode,
                        statusText: res.statusMessage,
                        headers: res.headers,
                        body,
                        data,
                    });
                } catch (error) {
                    reject(error);
                }
            });
        });

        // Handle request errors
        req.on('error', (error) => {
            reject(error);
        });

        // End the request
        req.end();
    });
};
