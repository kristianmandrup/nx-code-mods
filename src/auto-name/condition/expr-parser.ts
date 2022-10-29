import { unique } from '../utils';

export class ExpressionParser {
  pos: number;
  parts: string[] = [];

  constructor(node: any) {
    this.pos = node.pos;
  }

  name(): string {
    return '';
  }

  filter(list: string[]) {
    return unique(list).filter((x) => x);
  }
}
