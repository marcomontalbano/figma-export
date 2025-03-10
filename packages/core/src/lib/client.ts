import type * as Figma from '@figma/rest-api-spec';

const doFetch = async <T>(
  endpoint: `/${string}`,
  options: ClientOptions,
  params?: Record<string, unknown>,
) => {
  return fetch(
    `https://api.figma.com${endpoint}?${new URLSearchParams(JSON.parse(JSON.stringify(params)))}`,
    {
      headers: {
        'X-Figma-Token': options.personalAccessToken,
      },
    },
  ).then((res) => res.json() as T);
};

export function createClient(options: ClientOptions): ClientInterface {
  return {
    file: async (fileKey, params) =>
      doFetch(`/v1/files/${fileKey}`, options, params),
    fileImages: async (fileKey, params) =>
      doFetch(`/v1/images/${fileKey}`, options, params),
    fileNodes: async (fileKey, params) =>
      doFetch(`/v1/files/${fileKey}/nodes`, options, params),
  };
}

type ClientOptions = {
  personalAccessToken: string;
};

export type ClientInterface = {
  file: (
    file_key: Figma.GetFilePathParams['file_key'],
    params?: Figma.GetFileQueryParams,
  ) => Promise<Figma.GetFileResponse>;
  fileImages: (
    file_key: Figma.GetImagesPathParams['file_key'],
    params?: Figma.GetImagesQueryParams,
  ) => Promise<Figma.GetImagesResponse>;
  fileNodes: (
    file_key: Figma.GetFileNodesPathParams['file_key'],
    params?: Figma.GetFileNodesQueryParams,
  ) => Promise<Figma.GetFileNodesResponse>;
};
