import fs from 'node:fs';
import path from 'node:path';

const resolveNameOrPath = (nameOrPath: string): string => {
  const absolutePath = path.resolve(nameOrPath);
  return fs.existsSync(absolutePath) ? absolutePath : nameOrPath;
};

// biome-ignore lint/complexity/noBannedTypes: TODO: fix this
export const requirePackages = async <T extends Function>(
  packages: string[],
  baseOptions = {},
): Promise<T[]> => {
  return Promise.all(
    packages.map(async (_pkg) => {
      const pkgNameOrPath = resolveNameOrPath(_pkg);

      const pkg = await import(pkgNameOrPath).then((p) => p.default);

      return pkg(baseOptions);
    }),
  );
};

export function asUndefinableArray<T>(
  entry: T | T[] | undefined,
): T[] | undefined {
  return entry ? ([] as T[]).concat(entry) : undefined;
}

export function asArray<T>(entry: T | T[] | undefined): T[] {
  return asUndefinableArray(entry) ?? [];
}
