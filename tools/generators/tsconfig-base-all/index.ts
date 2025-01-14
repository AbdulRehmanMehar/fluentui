import { Tree, formatFiles, writeJson } from '@nrwl/devkit';
import { isEqual } from 'lodash';

import { TsconfigBaseAllGeneratorSchema } from './schema';
import { createPathAliasesConfig } from './lib/utils';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface NormalizedSchema extends ReturnType<typeof normalizeOptions> {}

export default async function (tree: Tree, schema: TsconfigBaseAllGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, schema);

  const { existingTsConfig, mergedTsConfig, tsConfigAllPath } = createPathAliasesConfig(tree);

  if (normalizedOptions.verify && !isEqual(existingTsConfig, mergedTsConfig)) {
    throw new Error(`
      🚨 ${tsConfigAllPath} is out of date.

      Please update it by running  'yarn nx workspace-generator tsconfig-base-all'.
    `);
  }

  writeJson(tree, tsConfigAllPath, mergedTsConfig);
  await formatFiles(tree);
}

function normalizeOptions(tree: Tree, options: TsconfigBaseAllGeneratorSchema) {
  const defaults = { verify: false };
  return {
    ...defaults,
    ...options,
  };
}
