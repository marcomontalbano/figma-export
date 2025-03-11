import type * as Figma from '@figma/rest-api-spec';

export function createClient(options: ClientOptions): ClientInterface {
  return {
    getFile: async (pathParams, queryParams) =>
      fetchGet('/v1/files/{file_key}', options, pathParams, queryParams),
    getImages: async (pathParams, queryParams) =>
      fetchGet('/v1/images/{file_key}', options, pathParams, queryParams),
    getFileNodes: async (pathParams, queryParams) =>
      fetchGet('/v1/files/{file_key}/nodes', options, pathParams, queryParams),
  };
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

  return fetch(
    `https://api.figma.com${endpoint}?${new URLSearchParams(JSON.parse(JSON.stringify(queryParams)))}`,
    {
      headers: {
        'X-Figma-Token': clientOptions.personalAccessToken,
      },
    },
  ).then((res) => res.json() as T);
};

type ClientOptions = {
  personalAccessToken: string;
};

/**
 * The Figma REST API client.
 */
export type ClientInterface = {
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
    Figma.GetFileResponse
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
    Figma.GetImagesResponse
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
    Figma.GetFileNodesResponse
  >;
};

type Get<
  PathParams extends Record<string, string>,
  QueryParams extends Record<string, unknown>,
  Response extends Record<string, unknown>,
> = (pathParams: PathParams, queryParams?: QueryParams) => Promise<Response>;
