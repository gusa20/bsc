import * as fs from 'fs'
import { Token, Num, Word} from '../src/models/token';
import { isNumber } from 'util';

export class Parser {
  private match(x : any) : boolean{
    return x;
  }

  public Program (){
    this.BStatement();
    while (this.BStatement()) continue;
    this.Int();
    this.match("END");
  }

  public BStatement () : boolean{
    this.Int();
    if (! (this.Assign() || this.Read() || this.Data () || this.Print() || this.Goto() || this.If()
           || this.For() || this.Next() || this.Dim() || this.Def() || this.Gosub() || this.Return() || this.Remark())){
      throw new Error("Parsing failed at BSTatement");
    };
    this.match("END");
    return false;
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
    else throw new Error("Parsing failed at Snum");
  }

  public Num (){
    this.Int();
    this.match(".");
    while (this.Digit()) continue;
  }

  public Int() : boolean {
    return false;
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

  public Remark() : boolean {
    this.match("REM");
    while(this.Character()) continue;
    return true;
  }
}
