import {
    Block,
    FunctionDeclaration,
  Node,
  Statement,
  VariableDeclaration,
  VariableStatement,
} from 'typescript';
import { tsquery } from '@phenomnomnominal/tsquery';

type WhereFn = (stmt: Node) => boolean

export const findDeclarationIdentifier = (vsNode: VariableStatement, targetIdName: string, where?: WhereFn): VariableDeclaration | undefined => {
    const result = tsquery(vsNode, `VariableDeclaration Identifier[name='${targetIdName}']`);
    if (!result) return
    const found = result[0] as VariableDeclaration
    if (!where) return found 
    if (where(found)) {
        return found
    }
}
  
export const findFunctionDeclaration = (vsNode: Statement, targetIdName: string): FunctionDeclaration | undefined => {
    const result = tsquery(vsNode, `FunctionDeclaration Identifier[name='${targetIdName}']`);
    if (!result) return
    return result[0] as FunctionDeclaration
}

const whereArrowFunction = (decl: Node) => {
    const found = tsquery(decl, 'ArrowFunction')
    if (!found) return false
    return Boolean(found[0])
}

type FindFunReturn = {        
    node: Node,
    declaration: boolean,
    arrow: boolean
}

export const findFunction = (vsNode: VariableStatement, targetIdName: string): FindFunReturn | undefined => {
    const declFun = findDeclarationIdentifier(vsNode, targetIdName, whereArrowFunction)
    if (declFun) return {
        node: declFun,
        declaration: true,
        arrow: false
    }

    const fun = findFunctionDeclaration(vsNode, targetIdName)
    if (fun) return {
        node: fun,
        declaration: false,
        arrow: true
    }
}

export const findFunctionBlock = (vsNode: VariableStatement, targetIdName: string): Block | undefined => {
    const fun = findFunction(vsNode, targetIdName);
    if (!fun) return 
    let result
    if (fun.arrow) {
        result = tsquery(fun.node, `ArrowFunction > Block`);
    }
    if (fun?.declaration) {
        result = tsquery(fun.node, `Block`);
    }    
    if (!result) return
    return result[0] as Block
}

export const findBlockStatementByIndex = (block: Block, index: number): Statement | undefined => {
    return block.statements.find((_, idx) => idx === index) as Statement
}
