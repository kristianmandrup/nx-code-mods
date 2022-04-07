# Nx Generator code mods

This library is intended to contain Code mods for use in Nx generators.

- `appendImport`
- `insertIntoNamedArray` (from [nextend](https://github.com/nxtend-team/nxtend/blob/main/packages/ionic-angular/src/generators/page/lib/update-routing-file.ts))

## Append import

Appends an import statement to the end of import declarations.

```ts
export function appendImport(
    tree: Tree,
    { projectRoot, relTargetFilePath, codeToInsert }: AppendImportOptions
  )
```  

### Sample usage

```ts
  const codeToInsert = `import { x } from 'x';
  `;
  appendImport(tree,
    {
        normalizedOptions.projectRoot,
        relTargetFilePath: '/src/app/app-routing.module.ts',
        codeToInsert
    }
  );
  await formatFiles(tree);
```

## Insert into named Array

The function takes the following arguments

```ts
export function insertIntoNamedArray(
  tree: Tree,
  { projectRoot, relTargetFilePath, targetIdName, codeToInsert, insertPos }: InsertArrayOptions
)
```

The function finds the file located at `relTargetFilePath` relative to the `projectRoot` path.
It takes the `toInsert` string and inserts it to a non-empty array with an Identifier matching the `targetIdName`. The `insertPos` argument can be either `start`, `end` or an index in the array.

### Sample usage

```ts
  const codeToInsert = `{
    x: 2
  },
  `;
  insertIntoNamedArray(tree,
    {
        normalizedOptions.projectRoot,
        relTargetFilePath: '/src/app/app-routing.module.ts',
        targetIdName: 'Routes',
        codeToInsert,
        insertPos: 'end'
    }
  );
  await formatFiles(tree);
```

## Insert code

Insert code at a specific position relative to a node

```ts
export const insertCode = (vsNode: any, insertPosition: number, codeToInsert: string): string
```

## Finders

```ts
export const findDeclarationIdentifier = (vsNode: VariableStatement, targetIdName: string, where?: WhereFn): VariableDeclaration | undefined
```

```ts
export const findFunctionDeclaration = (vsNode: Statement, targetIdName: string): FunctionDeclaration | undefined
```

```ts
export const findFunction = (vsNode: VariableStatement, targetIdName: string): FindFunReturn | undefined
```

```ts
export const findFunctionBlock = (vsNode: VariableStatement, targetIdName: string): : Block | undefined
```

```ts
export const findBlockStatementByIndex = (block: Block, index: number): : Statement | undefined
```


## Full example

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
  const codeToInsert = `{
    x: 2
  },
  `;
  insertIntoNamedArray(tree,
    {
        normalizedOptions.projectRoot,
        relTargetFilePath: '/src/app/app-routing.module.ts',
        targetIdName: 'Routes',
        codeToInsert,
        insertPos: 'end'
    }
  );
  await formatFiles(tree);
}

export default pageGenerator;
export const pageSchematic = convertNxGenerator(pageGenerator);
```
