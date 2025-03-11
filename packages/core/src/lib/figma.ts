import type * as Figma from '@figma/rest-api-spec';
import * as FigmaSDK from './client.js';

import { basename, dirname } from 'node:path';
import type * as FigmaExport from '@figma-export/types';
import pLimit from 'p-limit';
import pRetry from 'p-retry';

import {
  type PickOption,
  chunk,
  emptySvg,
  fetchAsSvgXml,
  forceArray,
  fromEntries,
  promiseSequentially,
} from './utils.js';

/**
 * Create a new Figma client.
 */
export const getClient = (token: string): FigmaSDK.ClientInterface => {
  if (!token) {
    throw new Error(
      "'Access Token' is missing. https://www.figma.com/developers/docs#authentication",
    );
  }

  return FigmaSDK.createClient({ personalAccessToken: token });
};

/**
 * Get the Figma document and styles from a `fileId` and a `version`.
 */
const getFile = async (
  client: FigmaSDK.ClientInterface,
  options: PickOption<
    FigmaExport.StylesCommand | FigmaExport.StylesCommand,
    'fileId' | 'version'
  >,
  params: {
    depth?: number;
    ids?: string[];
  },
): Promise<{
  document: Figma.DocumentNode | null;
  styles: { readonly [key: string]: Figma.Style } | null;
}> => {
  const { document = null, styles = null } = await client
    .getFile(
      { file_key: options.fileId },
      {
        version: options.version,
        depth: params.depth,
        ids: params.ids?.join(','),
      },
    )
    .catch((error: Error) => {
      throw new Error(
        `while fetching file "${options.fileId}${options.version ? `?version=${options.version}` : ''}": ${error.message}`,
      );
    });

  return { document, styles };
};

/**
 * Get all the pages (`Figma.Canvas`) from a document filtered by `onlyFromPages` (when set).
 * When `onlyFromPages` is not set it returns all the pages.
 */
const getPagesFromDocument = (
  document: Figma.DocumentNode,
  options: PickOption<
    FigmaExport.StylesCommand | FigmaExport.StylesCommand,
    'onlyFromPages'
  > = {},
): Figma.CanvasNode[] => {
  const onlyFromPages = forceArray(options.onlyFromPages);
  return document.children.filter((node): node is Figma.CanvasNode => {
    return (
      node.type === 'CANVAS' &&
      (onlyFromPages.length === 0 ||
        onlyFromPages.includes(node.name) ||
        onlyFromPages.includes(node.id))
    );
  });
};

/**
 * Get all the page ids filtered by `onlyFromPages`. When `onlyFromPages` is not set it returns all page ids.
 *
 * This method is particularly fast because it looks to a Figma file with `depth=1`.
 */
const getAllPageIds = async (
  client: FigmaSDK.ClientInterface,
  options: PickOption<
    FigmaExport.StylesCommand | FigmaExport.StylesCommand,
    'fileId' | 'version' | 'onlyFromPages'
  >,
): Promise<string[]> => {
  const { document } = await getFile(client, options, { depth: 1 });

  if (!document) {
    throw new Error("'document' is missing.");
  }

  const pageIds = getPagesFromDocument(document, options).map(
    (page) => page.id,
  );

  if (pageIds.length === 0) {
    const errorAsString = forceArray(options.onlyFromPages)
      .map((page) => `"${page}"`)
      .join(', ');

    throw new Error(
      `Cannot find any page with "onlyForPages" equal to [${errorAsString}].`,
    );
  }

  return pageIds;
};

/**
 * Determines whether the `searchElement.type` is included in the `availableTypes` list, returning true or false as appropriate.
 * @param availableTypes List of available node types.
 * @param searchNode The node to search for.
 */
function isNodeOfType<
  AvailableTypes extends Figma.Node['type'][],
  SearchNode extends Figma.Node,
>(
  availableTypes: AvailableTypes,
  searchNode: SearchNode,
): searchNode is Extract<SearchNode, { type: AvailableTypes[number] }> {
  return availableTypes.includes(searchNode.type);
}

export const getComponents = (
  children: readonly Figma.Node[],
  {
    filterComponent,
    includeTypes,
  }: Required<
    PickOption<
      FigmaExport.ComponentsCommand,
      'filterComponent' | 'includeTypes'
    >
  >,
  pathToComponent: FigmaExport.ComponentExtras['pathToComponent'] = [],
): FigmaExport.ComponentNode[] => {
  let components: FigmaExport.ComponentNode[] = [];

  for (const node of children) {
    if (isNodeOfType(includeTypes, node) && filterComponent(node)) {
      components.push({
        ...node,
        svg: '',
        figmaExport: {
          id: node.id,
          dirname: dirname(node.name),
          basename: basename(node.name),
          pathToComponent,
        },
      });
      continue;
    }

    if ('children' in node) {
      components = [
        ...components,
        ...getComponents(node.children, { filterComponent, includeTypes }, [
          ...pathToComponent,
          { name: node.name, type: node.type },
        ]),
      ];
    }
  }

  return components;
};

// eslint-disable-next-line no-underscore-dangle
const __getDocumentAndStyles = async (
  client: FigmaSDK.ClientInterface,
  options: PickOption<
    FigmaExport.ComponentsCommand,
    'fileId' | 'version' | 'ids' | 'onlyFromPages'
  >,
): ReturnType<typeof getFile> => {
  return getFile(client, options, {
    // when `onlyFromPages` is set, we avoid traversing all the document tree, but instead we get only requested ids.
    // eslint-disable-next-line no-nested-ternary
    ids:
      forceArray(options.ids).length > 0
        ? options.ids
        : forceArray(options.onlyFromPages).length > 0
          ? await getAllPageIds(client, options)
          : undefined,
  });
};

export const getDocument = async (
  client: FigmaSDK.ClientInterface,
  options: PickOption<
    FigmaExport.ComponentsCommand,
    'fileId' | 'version' | 'ids' | 'onlyFromPages'
  >,
): Promise<Figma.DocumentNode> => {
  const { document } = await __getDocumentAndStyles(client, options);

  if (document == null) {
    throw new Error("'document' is missing.");
  }

  return document;
};

export const getStyles = async (
  client: FigmaSDK.ClientInterface,
  options: PickOption<
    FigmaExport.StylesCommand,
    'fileId' | 'version' | 'ids' | 'onlyFromPages'
  >,
): Promise<{
  readonly [key: string]: Figma.Style;
}> => {
  const { styles } = await __getDocumentAndStyles(client, options);

  if (styles == null) {
    throw new Error("'styles' are missing.");
  }

  return styles;
};

export const getIdsFromPages = (pages: FigmaExport.PageNode[]): string[] =>
  pages.reduce(
    (ids: string[], page) =>
      ids.concat(page.components.map((component) => component.id)),
    [],
  );

const fileImages = async (
  client: FigmaSDK.ClientInterface,
  fileId: string,
  ids: string[],
  version?: string,
) => {
  const { images } = await client
    .getImages(
      {
        file_key: fileId,
      },
      {
        ids: ids.join(','),
        format: 'svg',
        svg_include_id: true,
        version,
      },
    )
    .catch((error: Error) => {
      throw new Error(`while fetching fileImages: ${error.message}`);
    });

  return images;
};

export const getImages = async (
  client: FigmaSDK.ClientInterface,
  fileId: string,
  ids: string[],
  version?: string,
) => {
  const idss = chunk(ids, 200);
  const limit = pLimit(30);

  const resolves = await Promise.all(
    idss.map((groupIds) => {
      return limit(() => fileImages(client, fileId, groupIds, version));
    }),
  );

  return Object.assign({}, ...resolves) as (typeof resolves)[number];
};

type FigmaExportFileSvg = {
  [key: string]: string;
};

type FileSvgOptions = {
  transformers?: FigmaExport.StringTransformer[];
  concurrency?: number;
  retries?: number;
  onFetchCompleted?: (data: { index: number; total: number }) => void;
};

export const fileSvgs = async (
  client: FigmaSDK.ClientInterface,
  fileId: string,
  ids: string[],
  version?: string,
  {
    concurrency = 30,
    retries = 3,
    transformers = [],
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onFetchCompleted = () => {},
  }: FileSvgOptions = {},
): Promise<FigmaExportFileSvg> => {
  const images = await getImages(client, fileId, ids, version);
  const limit = pLimit(concurrency);
  let index = 0;
  const svgPromises = Object.entries(images)
    .filter((image): image is [string, string] => typeof image[1] === 'string')
    .map(async ([id, url]) => {
      const svg = await limit(() =>
        pRetry(() => fetchAsSvgXml(url), { retries }),
      );
      const svgTransformed = await promiseSequentially(transformers, svg);

      index += 1;

      onFetchCompleted({
        index,
        total: ids.length,
      });

      return [id, svgTransformed];
    });

  const svgs = await Promise.all(svgPromises);

  return fromEntries(svgs);
};

export const getPagesWithComponents = (
  document: Figma.DocumentNode,
  options: Required<
    PickOption<
      FigmaExport.ComponentsCommand,
      'filterComponent' | 'includeTypes'
    >
  >,
): FigmaExport.PageNode[] => {
  const pages = getPagesFromDocument(document);
  return pages
    .map((page) => ({
      ...page,
      components: getComponents(page.children, options),
    }))
    .filter((page) => page.components.length > 0);
};

export const enrichPagesWithSvg = async (
  client: FigmaSDK.ClientInterface,
  fileId: string,
  pages: FigmaExport.PageNode[],
  version?: string,
  svgOptions?: FileSvgOptions,
): Promise<FigmaExport.PageNode[]> => {
  const componentIds = getIdsFromPages(pages);

  if (componentIds.length === 0) {
    throw new Error('No components found');
  }

  const svgs = await fileSvgs(
    client,
    fileId,
    componentIds,
    version,
    svgOptions,
  );

  return pages.map((page) => ({
    ...page,
    components: page.components.map((component) => ({
      ...component,
      svg: svgs[component.id] || emptySvg,
    })),
  }));
};
