function ctrlFlowHandler(instr){
    console.log("Control flow detected",instr)
    if(instr.startsWith("Lbl")){
        if(instr.length!=4&&!/\d/.test(instr[3])){
            alert("Argument ERROR");
            console.log("Argument ERROR");
            halt=true;
            return -1;
        }
        var pos=instr[3];
        if(pos in memory["Lbl"]){
            return 0;
        }
        memory["Lbl"][pos]=memory["instrptr"];
        return 0;
    }
    if(instr.startsWith("Goto")){
        if(instr.length!=5&&!/\d/.test(instr[4])){
            alert("Argument ERROR");
            console.log("Argument ERROR");
            halt=true;
            return -1;
        }
        var pos=instr[4];
        //backward jump
        if(pos in memory["Lbl"]){
            memory["jmpto"]=memory["Lbl"][pos];
            return 0;
        }

        //forward jump
        memory["skipUntilMatch"]=`Lbl${pos}`
        return 0;
    }
    if(instr.startsWith("WhileEnd")){
        if(instr.length!=8){
            alert("Argument ERROR");
            console.trace("Argument ERROR");
            halt=true;
            return -1;
        }
        if(memory["WhilePos"]==-1){
            alert("Syntax ERROR");
            console.trace("Syntax ERROR");
            halt=true;
            return -1;
        }
        if(memory["WhilePos"]==-2){
            memory["WhilePos"]==-1;
            return 0;
        }
        memory["jmpto"]=memory["WhilePos"];
        return 0;
    }
    if(instr.startsWith("While")){
        instr=instr.substr(5);
        var expr=expressionEval(instr);
        if(halt) return -1;
        console.log(expr)
        if(neq0(expr)){
            memory["WhilePos"]=memory["instrptr"];
        }else{
            memory["WhilePos"]=-2;
            memory["skipUntilMatch"]=/^WhileEnd/
        }
        return 0;
    }
    if(instr.startsWith("IfEnd")){
        if(instr.length!=5){
            alert("Syntax ERROR");
            console.log("Syntax ERROR");
            halt=true;
            return -1;
        }
        return 0;
    }
    if(instr.startsWith("Else")){
        if(memory["IfEval"]){
            memory["Display"]=false;
            memory["skipUntilMatch"]=/^IfEnd/;
            return 0;
        }
        instr=instr.substr(4);
        ExecuteInstruction(instr,1);
        if(halt)return -1;
        return 0;
    }
    if(instr.startsWith("Then")){
        instr=instr.substr(4);
        ExecuteInstruction(instr,1);
        if(halt)return -1;
        return 0;
    }

    if(instr.startsWith("If")){
        instr=instr.substr(2);
        var sto="";
        if(instr.substr(-2)=="M+"||instr.substr(-2)=="M-"){
            sto=instr.substr(-2);
            instr=instr.substr(0,instr.length-2);
        }
        var expr=expressionEval(instr);
        //console.log(sto,instr)
        if(halt)return -1;
        if(sto=="M+")
        memory["M"]+=expr;
        if(sto=="M-")
        memory["M"]-=expr;
        memory["IfEval"]=neq0(expr);
        if(!memory["IfEval"]){
            memory["skipUntilMatch"]=/^(Else.*|IfEnd)/
        }
        return 0;
    }
}
