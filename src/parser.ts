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

  private match(x : any) : boolean{
    return x;
  }

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
      let r = (this.Int() && this.match_("END", Word) && this.EndOfFile());
      if (r){
        console.log("[Production] Program -> BStatement {BStatement} int \"END\"");
        return true;
      } else {
        return false;
      }
    }
  }

  public BStatement () : boolean{
    return (this.Int() && this.Remark());
    // if (! (this.Assign() || this.Read() || this.Data () || this.Print() || this.Goto() || this.If()
    //        || this.For() || this.Next() || this.Dim() || this.Def() || this.Gosub() || this.Return() || this.Remark())){
    //   throw new Error("Parsing failed at BSTatement");
    // };
    // this.match("END");
    // return false;
  }

  public Assign() : boolean {
    this.match("LET");
    this.Var();
    this.match("=");
    this.Exp();
    return false;
  }

  public KleeneExp(){
    while (this.match(",") && this.Exp());
    return true;
  }

  public Var() : boolean {
    if ((this.Letter() && this.Digit())
        || (this.Letter()
            && this.match("\(")
            && this.Exp()
            && this.KleeneExp())){
      return true;
    }
    else return false;
  }

  public Exp() : boolean {
    return false;
  }

  public SNum (){
    if (this.match("+") && this.Num()) return true;
    else if (this.match("-") && this.Num()){
      return true;
    }
    else throw new Error("[Fail] SNum");
  }

  public Num (){
    this.Int();
    this.match(".");
    while (this.Digit()) continue;
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

  public Data() : boolean {
    return false;
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
    return false;
  }

  public Dim() : boolean {
    return false;
  }

  public Def() : boolean {
    return false;
  }

  public Gosub() : boolean {
    return false;
  }

  public Return() : boolean {
    return false;
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

  public match_(s : string, t : any){
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

  public match_except(s : string){
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
    while (this.match_except("\n"));
    return true;
  }

  public LineBreak(){
    return this.match_("\n", Token);
  }

  public Remark() : boolean {
    return (this.match_("REM", Word)
            && this.KleeneCharacter()
            && this.LineBreak());
  }
}
