# Nx Generator code mods

This library is intended to contain Code mods for use in Nx generators.

- `appendAfterImports`
- `insertIntoNamedObject`
- `insertIntoNamedArray` (from [nextend](https://github.com/nxtend-team/nxtend/blob/main/packages/ionic-angular/src/generators/page/lib/update-routing-file.ts))
- `insertClassMethod`
- `insertClassProperty`
- `insertClassDecorator`
- `insertClassMethodDecorator`
- `insertClassMethodParamDecorator`

The library in addition contains a number of utility methods which should make it easy to create your own Code Mods.

## Append after last import

Appends an import statement to the end of import declarations.

```ts
appendAfterImportsInFile(
  filePath: string,
  opts: InsertOptions,
)
```

In file tree

```ts
appendAfterImportsInTree = (
  tree: Tree,
  { projectRoot, relTargetFilePath, codeToInsert }: AppendImportOptions,
);
```

### Sample usage

```ts
const codeToInsert = `import { x } from 'x';
`;
appendAfterImportsInTree(
  tree,
  {
      normalizedOptions.projectRoot,
      relTargetFilePath: '/src/app/app-routing.module.ts',
      codeToInsert
  }
);
await formatFiles(tree);
```

## Insert into named Object

Insert code into a named array

```ts
type CollectionInsert = {
  index?: CollectionIndex;
  findElement?: FindElementFn;
  abortIfFound?: CheckUnderNode;
  relative?: BeforeOrAfter;
};

interface InsertObjectOptions {
  id: string;
  codeToInsert: string;
  insert?: CollectionInsert;
  indexAdj?: number;
}
```

Insert into src loaded from file

```ts
insertIntoNamedObjectInFile(
  filePath: string,
  opts: InsertObjectOptions,
)
```

In file tree

```ts
insertIntoNamedObjectInTree(
  tree: Tree,
  opts: InsertObjectTreeOptions,
)
```

The function finds the file located at `relTargetFilePath` relative to the `projectRoot` path.

It takes the `codeToInsert` string and inserts it into a non-empty object with an `Identifier` matching the `targetIdName`. The `insertPos` argument can be either `start`, `end`, an index in the object or a name of a property of the object.

### Sample usage

```ts
  const codeToInsert = `{
    x: 2
  },
  `;
  insertIntoNamedObjectInTree(tree,
    {
        normalizedOptions.projectRoot,
        relTargetFilePath: '/src/app/route-map.module.ts',
        id: 'RouteMap',
        codeToInsert,
        // insert code after this property assignment in the object
        insert: {
          relative: 'after',
          findElement: 'rootRoute'
        }
    }
  );
  await formatFiles(tree);
```

#### insert

Insert at start or end of object properties list

```ts
insert: {
  index: 'start'; // or 'end'
}
```

Insert `before` numeric position

```ts
insert: {
  relative: 'before',
  index: 1;
}
```

Insert `after` specific element

```ts
insert: {
  relative: 'after', // 'before' or 'after' node found via findElement
  findElement: (node: Node) => {
    // find specific property assignment node
  }
}
```

## Insert into named Array

Insert code into a named array

```ts
type CollectionInsert = {
  index?: CollectionIndex;
  findElement?: FindElementFn;
  abortIfFound?: CheckUnderNode;
  relative?: BeforeOrAfter;
};

interface InsertArrayOptions {
  id: string;
  codeToInsert: string;
  insert?: CollectionInsert;
  indexAdj?: number;
}
```

Insert into src loaded from file

```ts
insertIntoNamedArrayInFile(
  filePath: string,
  opts: InsertArrayOptions,
)
```

In file tree

```ts
insertIntoNamedArrayInTree(
  tree: Tree,
  opts: InsertArrayTreeOptions,
)
```

The function finds the file located at `relTargetFilePath` relative to the `projectRoot` path.

It takes the `codeToInsert` string and inserts it to a non-empty array with an Identifier matching the `targetIdName`. The `insertPos` argument can be either `start`, `end` or an index in the array.

### Sample usage

```ts
  const codeToInsert = `{
    x: 2
  }`;
  insertIntoNamedArrayInTree(tree,
    {
        normalizedOptions.projectRoot,
        relTargetFilePath: '/src/app/app-routing.module.ts',
        id: 'Routes',
        codeToInsert,
        insert: {
          index: 'end'
        }
    }
  );
  await formatFiles(tree);
```

#### insert

Insert at `start` or `end` of array elements list

```ts
insert: {
  index: 'start'; // or 'end'
}
```

Insert after numeric position

```ts
insert: {
  relative: 'after',
  index: 1;
}
```

Insert `before` specific element

```ts
insert: {
  relative: 'after', // 'before' or 'after' node found via findElement
  findElement: (node: Node) => {
    // find specific array element
  }
}
```

Insert `before` named identifier

```ts
insert: {
  relative: 'before',
  findElement: 'rootRoute'
}
```

## Insert class method

Add a class method to a class

```ts
insertClassMethodInTree(
  tree: Tree,
  opts: ClassMethodInsertTreeOptions
)
```

In file tree

```ts
insertClassMethodInFile(
  filePath: string,
  opts: ClassMethodInsertOptions
)
```

### Sample usage

```ts
const codeToInsert = `myMethod() {}`;
const inserted = insertClassMethodInFile(filePath, {
  codeToInsert,
  className: 'myClass',
  methodId: 'myMethod',
});
```

## Insert class property

Add class property to a class

```ts
insertClassPropertyInFile(
  filePath: string,
  opts: ClassPropInsertOptions,
)
```

In file tree

```ts
insertClassPropertyInTree(
  tree: Tree,
  opts: ClassPropInsertOptions
)
```

### Sample usage

```ts
const codeToInsert = `myProp: User`;
const inserted = insertClassPropertyInFile(filePath, {
  codeToInsert,
  className: 'myClass',
  propId: 'myProp',
});
```

## Insert class decorator

Add decorator to a class

```ts
insertClassDecoratorInFile(
  filePath: string,
  opts: ClassDecInsertOptions,
)
```

In file tree

```ts
insertClassDecoratorInTree(
  tree: Tree,
  opts: ClassDecInsertTreeOptions,
)
```

### Sample usage

```ts
const codeToInsert = `@Model()`;
const inserted = insertClassDecoratorInFile(filePath, {
  codeToInsert,
  id: 'myClass',
});
```

## Insert class method decorator

Add class method decorator (such as for NestJS)

```ts
insertBeforeMatchingMethod = (opts: AnyOpts) => (node: Node)
```

```ts
insertClassMethodDecoratorInTree(
  tree: Tree,
  opts: ClassMethodDecInsertOptions,
)
```

### Sample usage

```ts
const codeToInsert = `@Post()`;
const inserted = insertClassMethodDecoratorInFile(filePath, {
  codeToInsert,
  className: 'myClass',
  methodId: 'myMethod',
});
```

## Insert class method parameter decorator

Add parameter decorator to a class method

```ts
insertClassMethodParamDecoratorInFile(
  filePath: string,
  opts: ClassMethodDecParamInsertOptions,
)
```

In file tree

```ts
insertClassMethodParamDecoratorInTree(
  tree: Tree,
  opts: ClassMethodDecParamInsertTreeOptions,
)
```

### Sample usage

```ts
const codeToInsert = `@Body() body: string`;
const inserted = insertClassMethodParamDecoratorInFile(filePath, {
  codeToInsert,
  className: 'myClass',
  methodId: 'myMethod',
});
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
  const { importPath, pageNames } = normalizedOptions
  // code to be pre-pended to array
  const codeToInsert = `{
    path: '${pageNames.fileName}',
    loadChildren: () =>
      import('${importPath}').then((m) => m.${pageNames.className}PageModule),
  }`;
  insertIntoNamedArrayInTree(tree,
    {
        normalizedOptions.projectRoot,
        relTargetFilePath: '/src/app/app-routing.module.ts',
        id: 'Routes',
        codeToInsert,
        insert: {
          index: 'start'
        }
    }
  );
  await formatFiles(tree);
}

export default pageGenerator;
export const pageSchematic = convertNxGenerator(pageGenerator);
```
