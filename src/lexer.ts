import * as fs from 'fs'
import { Token, Num, Word, IToken} from '../src/models/token';
import { isNumber } from 'util';

export class Lexer {
  static readonly Letter = /[A-Za-z]/;
  static readonly Digit = /[0-9]/;
  static readonly Int = /^\d+/;
  static readonly Num = /^(\d+(\.\d*)?|\.\d+)((E)?[+-]\d+)?/;
  static readonly Composite = /^<>|>=|<=|==/;
  static readonly Special = /[@~`!@#$%^&*()=+\\';:"\/?>.<,-|]/;
  static readonly Word = new RegExp("^[a-zA-Z](\w|" + Lexer.Special.source + ")+");
  static readonly Character = Lexer.Letter + "|" + Lexer.Digit + "|" + Lexer.Special;
  static readonly Whitespace = /^[ \f\r\t\v\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+/;
  static readonly LineBreak = /\n/;

  private stripWhitespace= (s: string) => s.replace(Lexer.Whitespace,"");

  private ScanNum= (s: string) => {
    let ex = Lexer.Num.exec(s);
    if (ex == null){
      return {sTo: s,
              sFrom: s,
              token: undefined};
    }
    else {
      return {sTo: s.replace(Lexer.Num,""),
              sFrom: s,
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
      return {sTo: s,
              sFrom: s,
              token: undefined};
    }
    else {
      return {sTo: s.replace(Lexer.Composite,""),
              sFrom: s,
              token: this.resolveComposite(ex[0])};
    }
  }

  private ScanWord= (s: string) => {
    let ex = Lexer.Word.exec(s);
    if (ex == null){
      return {sTo: s,
              sFrom: s,
              token: undefined};
    }
    else {
      return {sTo: s.replace(Lexer.Word,""),
              sFrom: s,
              token: new Word(ex[0])};
    }
  }

  private ScanDefault= (s: string) => {
    return {sTo: s.substring(1),
            sFrom: s,
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


  public scan = (s : string) => {
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
    if (s != "") return this.ScanDefault(s);
    else return null;
  };
}
