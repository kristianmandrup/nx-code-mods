# Nx Generator code mods

This library is intended to contain Code mods for use in Nx generators.

- `appendAfterImports`
- `insertIntoNamedObject`
- `insertIntoNamedArray` (from [nextend](https://github.com/nxtend-team/nxtend/blob/main/packages/ionic-angular/src/generators/page/lib/update-routing-file.ts))

Generic utility functions

- `insertCode`
- `findDeclarationIdentifier`
- `findFunctionDeclaration`
- `findFunction`
- `findFunctionBlock`
- `findBlockStatementByIndex`
- `findClassDeclaration`
- `findMethodDeclaration`
- `findClassPropertyDeclaration`
- `insertClassProperty`
- `insertClassMethod`
- `insertClassDecorator`
- `insertClassMethodDecorator`
- `insertClassMethodParamDecorator`

## Append after last import

Appends an import statement to the end of import declarations.

```ts
appendAfterImports = (
  tree: Tree,
  { projectRoot, relTargetFilePath, codeToInsert }: AppendImportOptions,
);
```

```ts
insertAfterLastImport = (node: any, codeToInsert: string): string | undefined
```

### Sample usage

```ts
  const codeToInsert = `import { x } from 'x';
  `;
  appendAfterImports(tree,
    {
        normalizedOptions.projectRoot,
        relTargetFilePath: '/src/app/app-routing.module.ts',
        codeToInsert
    }
  );
  await formatFiles(tree);
```

## Insert into named Object

The function takes the following arguments

```ts
insertIntoNamedObject = (
  tree: Tree,
  {
    projectRoot,
    relTargetFilePath,
    targetIdName,
    codeToInsert,
    insertPos,
  }: InsertObjectOptions,
);
```

```ts
insertInObject = (
  node: any,
  id: string,
  codeToInsert: string,
  insertPos: ObjectPosition,
): string | undefined
```

The function finds the file located at `relTargetFilePath` relative to the `projectRoot` path.
It takes the `codeToInsert` string and inserts it into a non-empty object with an Identifier matching the `targetIdName`. The `insertPos` argument can be either `start`, `end`, an index in the object or a name of a property of the object.

### Sample usage

```ts
  const codeToInsert = `{
    x: 2
  },
  `;
  insertIntoNamedObject(tree,
    {
        normalizedOptions.projectRoot,
        relTargetFilePath: '/src/app/app-routing.module.ts',
        targetIdName: 'Routes',
        codeToInsert,
        // insert code before this property assignment in the object
        insertPos: 'name'
    }
  );
  await formatFiles(tree);
```

## Insert into named Array

The function takes the following arguments

```ts
insertIntoNamedArray = (
  tree: Tree,
  {
    projectRoot,
    relTargetFilePath,
    targetIdName,
    codeToInsert,
    insertPos,
  }: InsertArrayOptions,
);
```

```ts
insertInArray = (
  node: any,
  id: string,
  codeToInsert: string,
  insertPos: ArrayPosition,
): string | undefined
```

The function finds the file located at `relTargetFilePath` relative to the `projectRoot` path.
It takes the `codeToInsert` string and inserts it to a non-empty array with an Identifier matching the `targetIdName`. The `insertPos` argument can be either `start`, `end` or an index in the array.

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

## Where

```ts
export const whereHasArrowFunction = (node: Node) =>
```

```ts
export const whereHasDecorator = (node: Node, id?: string)
```

## Finders

```ts
findClassDeclaration = (vsNode: Node, targetIdName: string, where?: WhereFn): ClassDeclaration | undefined
```

```ts
export const findMethodDeclaration = (vsNode: Node, targetIdName: string, where?: WhereFn): MethodDeclaration | undefined =>
```

```ts
export const findClassPropertyDeclaration = (vsNode: Node, targetIdName: string, where?: WhereFn): PropertyDeclaration | undefined
```

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
