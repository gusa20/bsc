import * as fs from 'fs'
import { Token, Num, Word} from '../src/models/token';
import {Lexer} from './lexer';
import * as R from 'ramda';
import { isNumber } from 'util';

export class Parser {
  private lexer : Lexer;

  constructor(lexer : any){
    this.lexer = lexer;
  }

  public scanAll (path : string){
    var str = fs.readFileSync("resources/bubble-simple.b", 'utf8');
    do {
      var result = this.lexer.scan(str);
      if (result == null){
        console.log("we are done here.");
        return;
      }
      else {
        console.log(result.token && result.token.toString());
        let {sTo , sFrom, token} = result;
        str = sTo;
      }
    } while (1);
  }

  public parse (path : string) {
    this.source = fs.readFileSync("resources/bubble-simple.b", 'utf8');
    return this.Program();
  }

  private look : any;
  private source : any;

  public KleeneBStatement(){
    console.log("[Start] {BStatement}");
    while(1){
      let backup = this.source;
      let r = this.BStatement();
      if (!r) {
        console.log(`[Backtrack] BStatement`)
        this.source = backup;
        break;
      }
    };
    console.log("[END] {BStatement}");
  }

  public EndOfFile() : boolean {
    let x = this.lexer.scan(this.source) == null;
    return x;
  }

  public Program (){
    if (this.BStatement()){
      this.KleeneBStatement();
      let r = (this.Int() && this.match(Word, "END") && this.EndOfFile());
      if (r){
        console.log("[Production] Program -> BStatement {BStatement} int \"END\"");
        return true;
      } else {
        return false;
      }
    }
  }

  public BStatement () : boolean{
    return (this.Int() && (this.Return() || this.Remark() || this.Gosub() || this.Data()));
    // if (! (this.Assign() || this.Read() || this.Data () || this.Print() || this.Goto() || this.If()
    //        || this.For() || this.Next() || this.Dim() || this.Def() || this.Gosub() || this.Return() || this.Remark())){
    //   throw new Error("Parsing failed at BSTatement");
    // };
    // this.match("END");
    // return false;
  }

  public Assign() : boolean {
    return false;
  }

  public Var() : boolean {
    // if ((this.Letter() && this.Digit())
    //     || (this.Letter()
    //         && this.match("\(")
    //         && this.Exp()
    //         && this.KleeneExp())){
    //   return true;
    // }
    // else return false;
    return false;
  }

  public Exp() : boolean {
    return false;
  }

  public SNum (){
    // if (this.match("+") && this.Num()) return true;
    // else if (this.match("-") && this.Num()){
    //   return true;
    // }
    // else throw new Error("[Fail] SNum");
    return false;
  }

  public Num (){
    // this.Int();
    // this.match(".");
    // while (this.Digit()) continue;
  }

  public Int() : boolean {
    let res = this.lexer.scan(this.source);
    if (res == null) return false;
    else {
      let {sTo, token} = res;
      if (token instanceof Num){
        console.log(`[Accept] ${token}`);
        this.source = sTo;
        return true;
      }
      else return false;
    }
  }

  public Digit() : boolean{
    return false;
  }


  public Read() : boolean {
    return false;
  }

  public KleeneCommaSNum(){
    console.log("[Start] {, SNum}");
    while(1){
      let backup = this.source;
      let r = this.match(Token, ",") && this.Int();
      if (!r) {
        console.log(`[Backtrack] {, SNum}`);
        this.source = backup;
        break;
      }
    };
    console.log("[END] {, SNum}");
    return true;
  }

  public hue (){
    console.log("hue");
    console.log(this.source);
    return true;
  }
  public Data() : boolean {
    return this.match(Word, "DATA") && this.Int() && this.KleeneCommaSNum() && this.LineBreak();
  }

  public Print() : boolean {
    return false;
  }

  public Goto() : boolean {
    return false;
  }

  public If() : boolean {
    return false;
  }

  public For() : boolean {
    return false;
  }

  public Next() : boolean {
    //this.match("NEXT", Word); this.match_()
    return false;
  }

  public Dim() : boolean {
    return false;
  }

  public Def() : boolean {
    return false;
  }

  public Gosub() : boolean {
    return this.match(Word, "GOSUB") && this.Int() && this.LineBreak();
  }

  public Return() : boolean {
    return this.match(Word, "RETURN") && this.LineBreak();
  }

  public Special() : boolean {
    return false;
  }

  public Letter() : boolean {
    return false;
  }

  public Character () : boolean {
    return this.Letter() || this.Digit() || this.Special();
  }

  public match(t : any, s : string){
    let scaned = this.lexer.scan(this.source);
    if (scaned != null){
      let {token} = scaned;
      if (token && token instanceof t && token.getStr() == s){
        console.log(`[Accept] ${token}`);
        this.source = scaned.sTo;
        return true;
      } else return false;
    } else return false;
  }

  public matchexcept(s : string){
    let scaned = this.lexer.scan(this.source);
    if (scaned != null){
      let {token} = scaned;
      if (token && token.getStr() == s){
        console.log(`[MatchExcept Exit] ${token}`);
        return false;
      } else {
        console.log(`[Accept] ${token}`);
        this.source = scaned.sTo;
        return true;
      }
    } else return false;
  }

  public KleeneCharacter(){
    while (this.matchexcept("\n"));
    return true;
  }

  public LineBreak(){
    return this.match(Token, "\n");
  }

  public Remark() : boolean {
    return (this.match(Word, "REM")
            && this.KleeneCharacter()
            && this.LineBreak());
  }
}
