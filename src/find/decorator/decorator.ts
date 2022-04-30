import { tsquery } from '@phenomnomnominal/tsquery';
import { Decorator, Node, NodeArray } from 'typescript';
import { escapeRegExp } from '../../utils';

export const findMatchingDecoratorForNode = (
  node: Node,
  decoratorId: string,
): Decorator | undefined => {
  const decorators = node.decorators;
  if (!decorators) return;
  return findMatchingDecorator(decorators, decoratorId);
};

export const findMatchingDecorator = (
  decorators: NodeArray<Decorator>,
  decoratorId: string,
): Decorator | undefined => {
  let decorator;
  decorators.find((dec: Decorator) => {
    const decTxt = dec.getText();
    const decoratorRegExp = '^' + escapeRegExp(`@${decoratorId}`);
    if (decTxt.match(decoratorRegExp)) {
      decorator = dec;
    }
  });
  return decorator ? (decorator as Decorator) : undefined;
};

export const whereHasDecorator = (node: Node, id?: string) => {
  let query = 'Decorator ';
  if (id) {
    query = query.concat("> CallExpression > Identifier[name='${id}']'");
  }
  const found = tsquery(node, query);
  if (!found) return false;
  return Boolean(found[0].parent);
};
