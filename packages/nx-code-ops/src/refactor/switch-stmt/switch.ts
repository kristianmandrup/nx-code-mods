import { tsquery } from '@phenomnomnominal/tsquery';
import {
  SyntaxKind,
  Block,
  SourceFile,
  Expression,
  SwitchStatement,
  CaseOrDefaultClause,
  CaseClause,
  Statement,
  DefaultClause,
} from 'typescript';
import { camelizedIdentifier } from '../../auto-name';
import { expressionName } from '../../auto-name/expression';
import { findSwitchStatements } from '../../find';
import { replaceCode } from '../../modify';
import { wrapBlock } from '../convert';

const callFnTemplate = ({ name, params }: any) => `${name}({${params}})`;

const fnTemplate = ({ name, params, block }: any) =>
  `\nfunction ${name}({${params}}) ${block}\n`;

const fnDefaultTemplate = ({ name, block }: any) =>
  `\nfunction ${name}() ${block}\n`;

const callFnDefaultTemplate = ({ name }: any) => `${name}()`;

const getCaseName = (expression: Expression, caseName: string = 'case') => {
  const exprName = expressionName(expression);
  if (!exprName) return;
  const parts = [caseName, exprName];
  return camelizedIdentifier(parts);
};

const getDefaultCaseName = (caseName: string = 'case') => {
  const parts = [caseName, 'default'];
  return camelizedIdentifier(parts);
};

type CaseExtract = {
  fnCode?: string;
  callCode?: string;
};

const caseStmtToCode = (stmt: Statement): string => {
  return stmt.kind === SyntaxKind.BreakStatement
    ? 'return'
    : stmt.getFullText();
};

export const extractDefaultClause = (
  clause: DefaultClause,
  switchStmt: SwitchStatement,
  caseName: string,
): CaseExtract | undefined => {
  const { statements } = clause;
  const exprName = expressionName(switchStmt.expression);
  const name = getDefaultCaseName(caseName);
  if (!name) return;
  // TODO: find reference Ids as well
  const params = exprName;
  const stmtsCode = statements.map((stmt) => caseStmtToCode(stmt)).join('/n');
  const block = wrapBlock(stmtsCode);
  const fnCode = fnDefaultTemplate({ name, block });
  const callCode = callFnDefaultTemplate({ name });
  return { fnCode, callCode };
};

export const extractCaseClause = (
  clause: CaseClause,
  switchStmt: SwitchStatement,
  caseName: string,
): CaseExtract | undefined => {
  const { expression, statements } = clause;
  const exprName = expressionName(switchStmt.expression);
  const name = getCaseName(expression, caseName);
  if (!name) return;
  // TODO: find reference Ids as well
  const params = exprName;
  const stmtsCode = statements.map((stmt) => caseStmtToCode(stmt)).join('/n');
  const block = wrapBlock(stmtsCode);
  const fnCode = fnTemplate({ name, params, block });
  const callCode = callFnTemplate({ name, params });
  return { fnCode, callCode };
};

// SyntaxKind.CaseClause
export const extractClause = (
  clause: CaseOrDefaultClause,
  switchStmt: SwitchStatement,
  name: string,
) => {
  if (clause.kind === SyntaxKind.CaseClause) {
    return extractCaseClause(clause, switchStmt, name);
  }
  if (clause.kind === SyntaxKind.DefaultClause) {
    return extractDefaultClause(clause, switchStmt, name);
  }
  return undefined;
};

export const extractSwitch = (
  srcNode: SourceFile,
  switchStmt: SwitchStatement,
) => {
  const exprName = expressionName(switchStmt.expression) || '';
  const caseName = camelizedIdentifier([`is`, exprName]);
  const clauses: any = switchStmt.caseBlock.clauses;
  const extracted = clauses
    .map((clause: any) => extractClause(clause, switchStmt, caseName))
    .filter((x: any) => x);
  const positions = {
    startPos: switchStmt.getStart(),
    endPos: switchStmt.getEnd(),
  };
  const fnDefs = extracted.map((extract: CaseExtract) => extract.fnCode);
  const fnCalls = extracted.map((extract: CaseExtract) => extract.callCode);
  const fnDefsBlock = fnDefs.join('\n');
  const fnCallsBlock = fnCalls.join(' || ');
  const code = [fnDefsBlock, fnCallsBlock].join('\n');
  return replaceCode(srcNode, { ...positions, code });
};

export const extractSwitchStatements = (srcNode: SourceFile, block: Block) => {
  const switchStmts = findSwitchStatements(block);
  if (!switchStmts) return;
  const blocks = switchStmts.map((switchStmt) =>
    extractSwitch(srcNode, switchStmt),
  );
  return blocks.join('\n');
};
