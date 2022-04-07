# Nx Generator code mods

This library is intended to contain Code mods for use in Nx generators.

- `prependArray` (from [nextend](https://github.com/nxtend-team/nxtend/blob/main/packages/ionic-angular/src/generators/page/lib/update-routing-file.ts))

## Prepend Array

The function takes the following arguments

```ts
const prependArray = (
  tree: Tree,
  { projectRoot, relTargetFilePath, targetIdName, toInsert }
)
```

The function finds the file located at `relTargetFilePath` relative to the `projectRoot` path.
It takes the `toInsert` string and prepends it to a non-empty array with an Identifier matching the `targetIdName`

### Sample usage

```ts
import {
  convertNxGenerator,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';
import * as path from 'path';
import { NormalizedSchema, GeneratorSchema } from './schema';
import { prependArray } from 'nx-code-mods';

function normalizeOptions(
  tree: Tree,
  options: GeneratorSchema
): NormalizedSchema {
  const { appsDir, npmScope } = getWorkspaceLayout(tree);
  const projectRoot = `${appsDir}/${options.project}`;

  return {
    ...options,
    projectRoot,
    prefix: npmScope,
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    name: names(options.name).fileName,
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };

  const pageDir = options.directory
    ? path.join(
        options.projectRoot,
        `/src/app/${options.directory}/${names(options.name).fileName}`
      )
    : path.join(
        options.projectRoot,
        `/src/app/${names(options.name).fileName}`
      );

  generateFiles(tree, path.join(__dirname, 'files'), pageDir, templateOptions);
}

export async function pageGenerator(tree: Tree, options: GeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);
  // code to be pre-pended to array
  const toInsert = `{
    x: 2
  },
  `;
  prependArray(tree,
    {
        normalizedOptions.projectRoot,
        relTargetFilePath: '/src/app/app-routing.module.ts',
        targetIdName: 'Routes',
        toInsert
    }
  );
  await formatFiles(tree);
}

export default pageGenerator;
export const pageSchematic = convertNxGenerator(pageGenerator);
```
