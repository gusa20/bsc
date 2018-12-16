export interface IToken {
}

export class Token implements IToken {
  constructor(value : string){
    this.value = value;
  }

  value: string;

  public toString = () : string => {
    return `<Token,${this.value}>`;
  }
}


export class Word implements IToken {
  constructor(lexeme : string){
    this.lexeme = lexeme;
  }

  lexeme: string;

  public toString = () : string => {
    return `<Word,${this.lexeme}>`;
  }

  static readonly _ge = new Word("GE");
  static readonly _le = new Word("LE");
  static readonly _eq = new Word("EQ");
  static readonly _ne = new Word("NE");
  static readonly _true = new Word("true");
  static readonly _false = new Word("false");
  static readonly _minus = new Word("minus");
}

export class Num implements IToken {
  constructor(value : number){
    this.value = value;
  }

  public toString = () : string => {
    return `<Num,${this.value}>`;
  }

  value: number;
}
