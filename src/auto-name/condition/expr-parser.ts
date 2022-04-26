export class ExpressionParser {
  pos: number;

  constructor(node: any) {
    this.pos = node.pos;
  }

  name(): string {
    return '';
  }
}
