# Nx Generator code mods

This library is intended to contain Code Mods for use in generators (such as Nx monorepo generators, Ng (Angular) generators or any other generator).

The library includes a number of utility functions which should greatly simplify the creation of your own Code Mods.

<!-- vscode-markdown-toc -->

- [Append after last import](#Appendafterlastimport)
- [Insert import](#InsertintoImport)
- [Insert into named Object](#InsertintonamedObject)
- [Insert into named Array](#InsertintonamedArray)
- [Insert into function block](#Insertintofunctionblock)
- [Insert class method](#Insertclassmethod)
- [Insert class property](#Insertclassproperty)
- [Insert class decorator](#Insertclassdecorator)
- [Insert class method decorator](#Insertclassmethoddecorator)
- [Insert class method parameter decorator](#Insertclassmethodparameterdecorator)
- [Full example](#Fullexample)
- [Work in progress](#Workinprogress)

<!-- vscode-markdown-toc-config
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->

## <a name='Appendafterlastimport'></a>Append after last import

Appends an import statement to the end of import declarations.

```ts
appendAfterImportsInFile(
  filePath: string,
  opts: AppendAfterImportsOptions,
)
```

In file tree

```ts
appendAfterImportsInTree = (
  tree: Tree,
  { projectRoot, relTargetFilePath, codeToInsert }: AppendAfterImportsTreeOptions,
);
```

### <a name='Sampleusage'></a>Sample usage

```ts
const codeToInsert = `import { x } from 'x'`;
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

## <a name='InsertintoImport'></a>Insert into import

Inserts an identifier to be imported into an existing import declaration

```ts
insertImportInFile(
  filePath: string,
  opts: InsertImportOptions,
)
```

In file tree

```ts
insertImportInTree = (
  tree: Tree,
  { projectRoot, relTargetFilePath, codeToInsert }: InsertImportTreeOptions,
);
```

### <a name='Sampleusage'></a>Sample usage

Implicit import id

```ts
const code = insertImportInFile(filePath, {
  importId: 'x',
  importFileRef: './my-file',
});
```

Explicit import code with import alias

```ts
const codeToInsert = `x as xman`;
const code = insertImportInFile(filePath, {
  codeToInsert,
  importId: 'x',
  importFileRef: './my-file',
});
```

## <a name='InsertintonamedObject'></a>Insert into named Object

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

### <a name='Sampleusage-1'></a>Sample usage

```ts
  const codeToInsert = `x: 2`;
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

#### <a name='insert'></a>insert

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

## <a name='InsertintonamedArray'></a>Insert into named Array

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

### <a name='Sampleusage-1'></a>Sample usage

```ts
  const codeToInsert = `{
    x: 2
  }`
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

#### <a name='insert-1'></a>insert

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

## <a name='Insertintofunctionblock'></a>Insert into function block

Insert code into a function block

```ts
insertInsideFunctionBlockInTree(
  tree: Tree,
  opts: InsertFunctionTreeOptions
)
```

In file tree

```ts
insertInsideFunctionBlockInFile(
  filePath: string,
  opts: InsertFunctionOptions
)
```

### <a name='Sampleusage-1'></a>Sample usage

```ts
const code = insertInsideFunctionBlockInFile(filePath, {
  codeToInsert,
  id: 'myFun',
  insert: {
    index: 'end',
  },
});
```

`insert` allows for the same positional options as for inserting inside an array.

## <a name='Insertclassmethod'></a>Insert class method

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

### <a name='Sampleusage-1'></a>Sample usage

```ts
const codeToInsert = `myMethod() {}`;
const code = insertClassMethodInFile(filePath, {
  codeToInsert,
  classId: 'myClass',
  methodId: 'myMethod',
});
```

## <a name='Insertclassproperty'></a>Insert class property

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

### <a name='Sampleusage-1'></a>Sample usage

```ts
const codeToInsert = `myProp: User`;
const code = insertClassPropertyInFile(filePath, {
  codeToInsert,
  classId: 'myClass',
  propId: 'myProp',
});
```

## <a name='Insertclassdecorator'></a>Insert class decorator

Add decorator to a class

```ts
insertClassDecoratorInFile(
  filePath: string,
  opts: ClassDecoratorInsertOptions,
)
```

In file tree

```ts
insertClassDecoratorInTree(
  tree: Tree,
  opts: ClassDecoratorInsertTreeOptions,
)
```

### <a name='Sampleusage-1'></a>Sample usage

```ts
const codeToInsert = `@Model()`;
const code = insertClassDecoratorInFile(filePath, {
  codeToInsert,
  id: 'myClass',
});
```

## <a name='Insertclassmethoddecorator'></a>Insert class method decorator

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

### <a name='Sampleusage-1'></a>Sample usage

```ts
const codeToInsert = `@Post()`;
const code = insertClassMethodDecoratorInFile(filePath, {
  codeToInsert,
  classId: 'myClass',
  methodId: 'myMethod',
});
```

## <a name='Insertclassmethodparameterdecorator'></a>Insert class method parameter decorator

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

### <a name='Sampleusage-1'></a>Sample usage

```ts
const codeToInsert = `@Body() body: string`;
const code = insertClassMethodParamDecoratorInFile(filePath, {
  codeToInsert,
  classId: 'myClass',
  methodId: 'myMethod',
});
```

## <a name='Fullexample'></a>Full example

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
      import('${importPath}').then((m) => m.${pageNames.classId}PageModule),
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

## <a name='Workinprogress'></a>Work In Progress

An outline of each these functions have been implemented.
Requires testing and further refinement to be completed.

- `removeFromNamedArray`
- `removeClassDecorator`
- `removeClassMethod`
- `removeClassProperty`
- `removeClassMethodParams`
- `removeClassMethodParamDecorator`
- `removeInsideFunctionBlock`
- `removeImportId`
- `removeImport`
- `removeFromNamedObject`

### Replace (WIP)

- `replaceInNamedObject`
- `replaceInNamedArray`
- `replaceClassDecorator`
- `replaceClassMethodDecorator`
- `replaceClassMethodParams`
- `replaceClassMethod`
- `replaceClassProperty`
- `replaceImportIds`
- `replaceInFunction`

### APIs (WIP)

- Chain API
- Insert API
- Remove API
- Replace API
- Transform API

#### Chain API

- `chainApi(source: string)`

Example

```ts
const chain = chainApi(source);
const { insert, remove } = chain;

insert
  .classDecorator({
    codeToInsert: '@Model()',
    id: 'myClass',
  })
  .classMethodDecorator({
    codeToInsert: '@Post()',
    classId: 'myClass',
    methodId: 'myMethod',
  });

remove.fromNamedArray({
  id: 'Routes',
  codeToInsert: `{ x: 2 }`,
  insert: {
    index: 'end',
  },
});
```

#### Insert API

- `insertApi(source: string)`

Example

```ts
const insert = insertApi(source);

insert.classDecorator({
  codeToInsert: '@Model()',
  id: 'myClass',
});
```

#### Remove API

- `removeApi(source: string)`

Example

```ts
const remove = removeApi(source);

remove.fromNamedArray({
  id: 'Routes',
  remove: {
    index: 'end',
  },
});
```

#### Replace API

- `replaceApi(source: string)`

Example

```ts
const replace = replaceApi(source);

replace.inNamedObject({
  id: 'Routes',
  codeToInsert: `{ x: 2 }`,
  replace: {
    index: 'end',
  },
});
```

### Transform API

- `async transformInTree(tree, opts)`
- `transformInFile(filePath, opts)`

Example

```ts
const opts = {
  normalizedOptions.projectRoot,
  relTargetFilePath: '/src/app/app-routing.module.ts',
  format: true,
  transform: (source) => {
    const chain = chainApi(source).setDefaultOpts({ classId: 'myClass' });
    const { insert, remove } = chain;
    insert
      .classDecorator({
        code: '@Model()',
      })
      .classMethodDecorator({
        code: '@Post()',
        methodId: 'myMethod',
      });
    return chain.source;
  },
};
await transformInTree(tree, opts);
```
