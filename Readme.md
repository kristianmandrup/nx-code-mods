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

- `appendAfterImportsInSource`
- `appendAfterImportsInFile`
- `appendAfterImportsInTree`

### <a name='Sampleusage'></a>Sample usage

```ts
const code = `import { x } from 'x'`;
appendAfterImportsInTree(
  tree,
  {
      normalizedOptions.projectRoot,
      relTargetFilePath: '/src/app/app-routing.module.ts',
      code
  }
);
await formatFiles(tree);
```

## <a name='InsertintoImport'></a>Insert into import

Inserts an identifier to import into an existing import declaration

- `insertImportInSource`
- `insertImportInFile`
- `insertImportInTree`

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
const code = `x as xman`;
const code = insertImportInFile(filePath, {
  code,
  importId: 'x',
  importFileRef: './my-file',
});
```

## <a name='InsertintonamedObject'></a>Insert into named Object

Insert code into a named object

```ts
type CollectionInsert = {
  index?: CollectionIndex;
  findElement?: FindElementFn;
  abortIfFound?: CheckUnderNode;
  relative?: BeforeOrAfter;
};

interface InsertObjectOptions {
  varId: string;
  code: string;
  insert?: CollectionInsert;
  indexAdj?: number;
}
```

- `insertIntoNamedObjectInSource`
- `insertIntoNamedObjectInFile`
- `insertIntoNamedObjectInTree`

Inserts the `code` in the object named `varId`.

### <a name='Sampleusage-1'></a>Sample usage

```ts
  insertIntoNamedObjectInTree(tree,
    {
        normalizedOptions.projectRoot,
        relTargetFilePath: '/src/app/route-map.module.ts',
        varId: 'RouteMap',
        code: `x: 2`,
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
  varId: string;
  code: string;
  insert?: CollectionInsert;
  indexAdj?: number;
}
```

Insert into src loaded from file

- `insertIntoNamedArrayInSource`
- `insertIntoNamedArrayInFile`
- `insertIntoNamedArrayInTree`

Inserts the `code` in the array named `varId`.

### <a name='Sampleusage-1'></a>Sample usage

```ts
  insertIntoNamedArrayInTree(tree,
    {
        normalizedOptions.projectRoot,
        relTargetFilePath: '/src/app/app-routing.module.ts',
        varId: 'Routes',
        code: `{ x: 2 }`,
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

- `insertInsideFunctionBlockInSource`
- `insertInsideFunctionBlockInFile`
- `insertInsideFunctionBlockInTree`

### <a name='Sampleusage-1'></a>Sample usage

```ts
insertInsideFunctionBlockInFile(filePath, {
  code,
  functionId: 'myFun',
  insert: {
    index: 'end',
  },
});
```

`insert` allows for the same positional options as for inserting inside an array.

## <a name='Insertclassmethod'></a>Insert class method

Add a class method to a class

- `insertClassMethodInSource`
- `insertClassMethodInFile`
- `insertClassMethodInTree`

### <a name='Sampleusage-1'></a>Sample usage

```ts
insertClassMethodInFile(filePath, {
  code: `myMethod() {}`,
  classId: 'myClass',
  methodId: 'myMethod',
});
```

## <a name='Insertclassproperty'></a>Insert class property

Add class property to a class

- `insertClassPropertyInSource`
- `insertClassPropertyInFile`
- `insertClassPropertyInTree`

### <a name='Sampleusage-1'></a>Sample usage

```ts
insertClassPropertyInFile(filePath, {
  code: `myProp: User`,
  classId: 'myClass',
  propertyId: 'myProp',
});
```

## <a name='Insertclassdecorator'></a>Insert class decorator

Add decorator to a class

- `insertClassDecoratorInSource`
- `insertClassDecoratorInFile`
- `insertClassDecoratorInTree`

### <a name='Sampleusage-1'></a>Sample usage

```ts
insertClassDecoratorInFile(filePath, {
  code: `@Model()`,
  classId: 'myClass',
});
```

## <a name='Insertclassmethoddecorator'></a>Insert class method decorator

Add class method decorator (such as for NestJS)

- `insertClassMethodDecoratorInSource`
- `insertClassMethodDecoratorInFile`
- `insertClassMethodDecoratorInTree`

### <a name='Sampleusage-1'></a>Sample usage

```ts
const code = insertClassMethodDecoratorInFile(filePath, {
  code: `@Post()`,
  classId: 'myClass',
  methodId: 'myMethod',
});
```

## <a name='Insertclassmethodparameterdecorator'></a>Insert class method parameter decorator

Add parameter decorator to a class method

- `insertClassMethodParamDecoratorInSource`
- `insertClassMethodParamDecoratorInFile`
- `insertClassMethodParamDecoratorInTree`

### <a name='Sampleusage-1'></a>Sample usage

```ts
const code = insertClassMethodParamDecoratorInFile(filePath, {
  code: `@Body() body: string`,
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
  const code = `{
    path: '${pageNames.fileName}',
    loadChildren: () =>
      import('${importPath}').then((m) => m.${pageNames.classId}PageModule),
  }`;

  insertIntoNamedArrayInTree(tree,
    {
        normalizedOptions.projectRoot,
        relTargetFilePath: '/src/app/app-routing.module.ts',
        varId: 'Routes',
        code,
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
    code: '@Model()',
    classId: 'myClass',
  })
  .classMethodDecorator({
    code: '@Post()',
    classId: 'myClass',
    methodId: 'myMethod',
  });

remove.fromNamedArray({
  varId: 'Routes',
  code: `{ x: 2 }`,
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
  code: '@Model()',
  classId: 'myClass',
});
```

#### Remove API

- `removeApi(source: string)`

Example

```ts
const remove = removeApi(source);

remove.fromNamedArray({
  varId: 'Routes',
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
  varId: 'Routes',
  code: `{ x: 2 }`,
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
