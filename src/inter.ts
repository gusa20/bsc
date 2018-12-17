public emitJump(t : IToken){
  emit("J " + LabelOrRegister(t))
}

public emitJump(t : string){
  emit("J " + LabelOrRegister(t))
}
public emitPrint(t : string){
  emit("la" + registerForCtx(t) + "," + printDestLabel(t));
  emit("li" + tempRegister(t) + 0);
  emit("li" + resultRegister(t) + "," + 4);
  emit("la" + inputRegister() + "," + newPrintLabel().toString());
}

public emitVar(t : IToken){
  var label = newLabel();
  emitBody()
  }

public handleProgramStart(){
  var begin = this.newlabel();
  this.emitHeader();
  this.emitLabel(begin);
}

public handleProgramAccepted(){
  this.emitData();
  this.emitAllDefs();
}
