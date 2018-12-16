import * as fs from 'fs'
import { Token, Num, Word, IToken} from '../src/models/token';
import { isNumber } from 'util';

export class Lexer {
  static readonly Letter = /[A-Za-z]/;
  static readonly Digit = /[0-9]/;
  static readonly Int = /^\d+/;
  static readonly Num = /^(\d+(\.\d*)?|\.\d+)((E)?[+-]\d+)?/;
  static readonly Composite = /^<>|>=|<=|==/;
  static readonly Special = /[@~`!@#$%^&*()_=+\\';:"\/?>.<,-|]/;
  static readonly Word = new RegExp("[a-zA-Z](\w|" + Lexer.Special.source + ")+");
  static readonly Character = Lexer.Letter + "|" + Lexer.Digit + "|" + Lexer.Special;
  static readonly Whitespace = /^\s+/;

  private stripWhitespace= (s: string) => s.replace(Lexer.Whitespace,"");

  private ScanNum= (s: string) => {
    let ex = Lexer.Num.exec(s);
    if (ex == null){
      return {s: s,
              token: undefined};
    }
    else {
      return {s: s.replace(Lexer.Num,""),
              token: new Num(Number(ex[0]))};
    }
  }

  resolveComposite = (x : string) : IToken | undefined => {
    switch (x){
      case "<>": return Word._ne;
      case ">=": return Word._ge;
      case "<=": return Word._le;
      case "==": return Word._eq;
      default: return undefined;
    }
  }
  private ScanComposite= (s: string) => {
    let ex = Lexer.Composite.exec(s);
    if (ex == null){
      return {s: s,
              token: undefined};
    }
    else {
      return {s: s.replace(Lexer.Composite,""),
              token: this.resolveComposite(ex[0])};
    }
  }

  private ScanWord= (s: string) => {
    let ex = Lexer.Word.exec(s);
    if (ex == null){
      return {s: s,
              token: undefined};
    }
    else {
      return {s: s.replace(Lexer.Word,""),
              token: new Word(ex[0])};
    }
  }

  private ScanDefault= (s: string) => {
    return {s: s.substring(1),
            token: new Token(s[0])};
  }

  public reservedWords = [(new Word("IF"),
                           new Word("THEN"),
                           new Word("STEP"),
                           new Word("TO"),
                           new Word("ELSE"),
                           new Word("ELSE"),
                           new Word("FOR"),
                           new Word("DIM"),
                           new Word("PRINT"),
                           new Word("LET"),
                           new Word("READ"),
                           new Word("DATA"),
                           new Word("NEXT"),
                           new Word("DEF FN"),
                           new Word("GOSUB"),
                           new Word("RETURN"),
                           new Word("REM"))]


  public scan = () => {
    var s = fs.readFileSync("resources/bubble-simple.b", 'utf8');
    s= this.stripWhitespace(s);
    let maybeComposite = this.ScanComposite(s);
    if (maybeComposite.token != undefined){
      return maybeComposite;
    }
    let maybeNum = this.ScanNum(s);
    if (maybeNum.token != undefined){
      return maybeNum;
    }
    let maybeWord = this.ScanWord(s);
    if (maybeWord.token != undefined){
      return maybeWord;
    }
    return this.ScanDefault(s);
  };

}
