import { tsquery } from '@phenomnomnominal/tsquery';
import {
  SyntaxKind,
  Block,
  SourceFile,
  Expression,
  SwitchStatement,
  CaseOrDefaultClause,
  CaseClause,
} from 'typescript';
import { blockName, camelizedIdentifier, conditionName } from '../../auto-name';
import { findSwitchStatements } from '../../find';
import { findBlock } from '../../find/block';

const callFnTemplate = ({ name, params }: any) => `${name}({${params}});\n`;

const fnTemplate = ({ name, params, block }: any) =>
  `\nfunction ${name}({${params}}) ${block}\n`;

const wrapBlock = (src: string) => {
  return '{' + src + '}';
};

const caseName = (expression: Expression) => {
  const blockCode = wrapBlock(expression.getText());
  const $block = tsquery.ast(blockCode);
  const block = findBlock($block);
  if (!block) return;
  const exprName = blockName(block);
  if (!exprName) return;
  const parts = [`case`, exprName];
  return camelizedIdentifier(parts);
};

export const extractCaseClause = (srcNode: SourceFile, clause: CaseClause) => {
  const { expression, statements } = clause;
  const name = caseName(expression);
  if (!name) return;
  const params = 'data';
  const stmtsCode = statements.map((stmt) => stmt.getFullText()).join('/n');
  const block = wrapBlock(stmtsCode);
  const fnCode = fnTemplate({ name, params, block });
  return fnCode;
};

// SyntaxKind.CaseClause
export const extractClause = (
  srcNode: SourceFile,
  clause: CaseOrDefaultClause,
) => {
  if (clause.kind === SyntaxKind.CaseClause) {
    extractCaseClause(srcNode, clause);
  }
};

export const extractSwitch = (
  srcNode: SourceFile,
  switchStmt: SwitchStatement,
) => {
  let clauses: any = switchStmt.caseBlock.clauses;
  clauses = [clauses[0]];
  clauses.map((clause: any) => {
    extractClause(srcNode, clause);
  });
  return '';
};

export const extractSwitchStatements = (srcNode: SourceFile, block: Block) => {
  const switchStmts = findSwitchStatements(block);
  if (!switchStmts) return;
  switchStmts.map((switchStmt) => {
    extractSwitch(srcNode, switchStmt);
  });
  return '';
};
