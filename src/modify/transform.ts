import { Tree } from '@nrwl/devkit';
import { modifyTree, replaceInFile } from './modify-file';
import { TSQuerySourceTransformer } from './replace';

interface TransformOpts {
  transform: (source: string) => string;
}

export const applyTransform =
  (opts: TransformOpts): TSQuerySourceTransformer =>
  (source: any): string | undefined => {
    return opts.transform(source);
  };

export function transformInFile(filePath: string, opts: any) {
  return replaceInFile(filePath, {
    ...opts,
    modifySrcFn: applyTransform,
  });
}

export async function transformInTree(tree: Tree, opts: any) {
  return await modifyTree(tree, {
    ...opts,
    modifySrcFn: applyTransform,
  });
}
