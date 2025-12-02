import type * as Figma from '@figma/rest-api-spec';
import pRetry from 'p-retry';

export function createClient(options: ClientOptions): ClientInterface {
  const hasError = (
    response: Record<string, unknown>,
  ): response is
    | Figma.ErrorResponsePayloadWithErrMessage
    | Figma.ErrorResponsePayloadWithErrorBoolean =>
    ('err' in response && response.err != null) ||
    ('error' in response && response.error === true);

  return {
    hasError,
    extractErrorMessage: (response) => {
      if (hasError(response)) {
        if ('err' in response) {
          return response.err;
        } else {
          return response.message;
        }
      }

      return null;
    },
    getFile: async (pathParams, queryParams) =>
      fetchGet('/v1/files/{file_key}', options, pathParams, queryParams),
    getImages: async (pathParams, queryParams) =>
      fetchGet('/v1/images/{file_key}', options, pathParams, queryParams),
    getFileNodes: async (pathParams, queryParams) =>
      fetchGet('/v1/files/{file_key}/nodes', options, pathParams, queryParams),
  };
}

class RateLimitError extends Error {
  retryAfterSec: number;
  figmaPlanTier: string | null;
  figmaRateLimitType: string | null;

  constructor(
    message: string,
    meta: {
      retryAfterSec: number;
      figmaPlanTier: string | null;
      figmaRateLimitType: string | null;
    },
  ) {
    super(message);
    this.name = 'RateLimitError';
    this.retryAfterSec = meta.retryAfterSec;
    this.figmaPlanTier = meta.figmaPlanTier;
    this.figmaRateLimitType = meta.figmaRateLimitType;
  }
}

const fetchGet = async <T>(
  rawEndpoint: `/${string}`,
  clientOptions: ClientOptions,
  pathParams: Record<string, string>,
  queryParams?: Record<string, unknown>,
) => {
  const endpoint = Object.entries(pathParams).reduce(
    (acc, [key, value]) => acc.replace(`{${key}}`, value) as `/${string}`,
    rawEndpoint,
  );

  const run = async () => {
    return fetch(
      `https://api.figma.com${endpoint}${queryParams != null ? `?${new URLSearchParams(JSON.parse(JSON.stringify(queryParams)))}` : ''}`,
      {
        headers: {
          'X-Figma-Token': clientOptions.personalAccessToken,
        },
      },
    ).then((response) => {
      if (response.status === 429) {
        throw new RateLimitError('Rate limit exceeded', {
          retryAfterSec: Number(response.headers.get('Retry-After')) || 1,
          figmaPlanTier: response.headers.get('X-Figma-Plan-Tier'),
          figmaRateLimitType: response.headers.get('X-Figma-Rate-Limit-Type'),
        });
      }

      return response.json() as T;
    });
  };

  const result = await pRetry(run, {
    retries: 2,
    shouldRetry: ({ error }) => {
      if (error instanceof RateLimitError) {
        /** Delay retry based on Retry-After header in milliseconds */
        const delay = error.retryAfterSec * 1000;
        const maxDelay = 60 * 60 * 1000; // 1 hour

        if (delay > maxDelay) {
          clientOptions.log(
            `rate limit exceeded, retry-after is too long (${millisecondsToReadableString(
              delay,
            )}), aborting retries\nhttps://developers.figma.com/docs/rest-api/rate-limits\n`,
          );

          return false;
        }

        clientOptions.log(
          `rate limit exceeded, retrying in ${millisecondsToReadableString(delay)}`,
        );

        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(true);
          }, delay);
        });
      }

      return true;
    },
    shouldConsumeRetry: ({ error }) => {
      return !(error instanceof RateLimitError);
    },
  });

  return result;
};

type ClientOptions = {
  personalAccessToken: string;
  log: (msg: string) => void;
};

/**
 * The Figma REST API client.
 */
export type ClientInterface = {
  /**
   * Check if the response from Figma API contains an error.
   */
  hasError: (
    response: Record<string, unknown>,
  ) => response is
    | Figma.ErrorResponsePayloadWithErrMessage
    | Figma.ErrorResponsePayloadWithErrorBoolean;
  /**
   * Extract error message from Figma API response.
   */
  extractErrorMessage: (response: Record<string, unknown>) => string | null;
  /**
   * Returns the document identified by `file_key` as a JSON object. The file key can be parsed from any Figma file url: `https://www.figma.com/file/{file_key}/{title}`.
   *
   * The `document` property contains a node of type `DOCUMENT`.
   *
   * The `components` property contains a mapping from node IDs to component metadata. This is to help you determine which components each instance comes from.
   */
  getFile: Get<
    Figma.GetFilePathParams,
    Figma.GetFileQueryParams,
    | Figma.GetFileResponse
    | Figma.ErrorResponsePayloadWithErrMessage
    | Figma.ErrorResponsePayloadWithErrorBoolean
  >;
  /**
   * Renders images from a file.
   *
   * If no error occurs, `"images"` will be populated with a map from node IDs to URLs of the rendered images, and `"status"` will be omitted. The image assets will expire after 30 days. Images up to 32 megapixels can be exported. Any images that are larger will be scaled down.
   *
   * Important: the image map may contain values that are `null`. This indicates that rendering of that specific node has failed. This may be due to the node id not existing, or other reasons such has the node having no renderable components. It is guaranteed that any node that was requested for rendering will be represented in this map whether or not the render succeeded.
   *
   * To render multiple images from the same file, use the `ids` query parameter to specify multiple node ids.
   *
   * ```
   * GET /v1/images/:key?ids=1:2,1:3,1:4
   * ```
   */
  getImages: Get<
    Figma.GetImagesPathParams,
    Figma.GetImagesQueryParams,
    | Figma.GetImagesResponse
    | Figma.ErrorResponsePayloadWithErrMessage
    | Figma.ErrorResponsePayloadWithErrorBoolean
  >;
  /**
   * Returns the nodes referenced to by `ids` as a JSON object. The nodes are retrieved from the Figma file referenced to by `file_key`.
   *
   * The node ID and file key can be parsed from any Figma node url: `https://www.figma.com/file/{file_key}/{title}?node-id={id}`
   *
   * The `name`, `lastModified`, `thumbnailUrl`, `editorType`, and `version` attributes are all metadata of the specified file.
   *
   * The `linkAccess` field describes the file link share permission level. There are 5 types of permissions a shared link can have: `"inherit"`, `"view"`, `"edit"`, `"org_view"`, and `"org_edit"`. `"inherit"` is the default permission applied to files created in a team project, and will inherit the project's permissions. `"org_view"` and `"org_edit"` restrict the link to org users.
   *
   * The `document` attribute contains a Node of type `DOCUMENT`.
   *
   * The `components` key contains a mapping from node IDs to component metadata. This is to help you determine which components each instance comes from.
   *
   * By default, no vector data is returned. To return vector data, pass the geometry=paths parameter to the endpoint.
   * Each node can also inherit properties from applicable styles. The styles key contains a mapping from style IDs to style metadata.
   *
   * Important: the nodes map may contain values that are `null`. This may be due to the node id not existing within the specified file.
   */
  getFileNodes: Get<
    Figma.GetFileNodesPathParams,
    Figma.GetFileNodesQueryParams,
    | Figma.GetFileNodesResponse
    | Figma.ErrorResponsePayloadWithErrMessage
    | Figma.ErrorResponsePayloadWithErrorBoolean
  >;
};

type Get<
  PathParams extends Record<string, string>,
  QueryParams extends Record<string, unknown>,
  Response extends Record<string, unknown>,
> = (pathParams: PathParams, queryParams?: QueryParams) => Promise<Response>;

/**
 * Converts milliseconds to a human-readable string.
 * @param milliseconds The duration in milliseconds.
 * @returns A human-readable string representing the duration.
 */
function millisecondsToReadableString(milliseconds: number): string {
  function numberEnding(number: number): string {
    return number > 1 ? 's' : '';
  }

  let temp = Math.floor(milliseconds / 1000);
  const years = Math.floor(temp / 31536000);
  if (years) {
    return `${years} year${numberEnding(years)}`;
  }

  // biome-ignore lint/suspicious/noAssignInExpressions: Ignored
  const days = Math.floor((temp %= 31536000) / 86400);
  if (days) {
    return `${days} day${numberEnding(days)}`;
  }
  // biome-ignore lint/suspicious/noAssignInExpressions: Ignored
  const hours = Math.floor((temp %= 86400) / 3600);
  if (hours) {
    return `${hours} hour${numberEnding(hours)}`;
  }
  // biome-ignore lint/suspicious/noAssignInExpressions: Ignored
  const minutes = Math.floor((temp %= 3600) / 60);
  if (minutes) {
    return `${minutes} minute${numberEnding(minutes)}`;
  }
  const seconds = temp % 60;
  if (seconds) {
    return `${seconds} second${numberEnding(seconds)}`;
  }
  return 'less than a second'; //'just now' //or other string you like;
}
