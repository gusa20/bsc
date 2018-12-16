export interface SymbolTable {
  [name: string] : Symbol
}

export interface Symbol {
  type: SymbolType
  value?: any
}

export enum SymbolType {
  Lexeme
}
