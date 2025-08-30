function isOperator(instr){
    for(var i in operationList){
        var op=operationList[i]
        if(instr.startsWith(op)){
            instr=instr.substr(op.length)
            return op;
        }
    }
    return false;
}

function isVar(instr){
    for(var i in operationList){
        var val=valSuffix[i]
        if(instr.startsWith(val)){
            return val;
        }
    }
    return false;
}

function applyToStack(numstack,op){
    var tmpstack=[];
    for(var i=0;i<opProp[op][col["opParam"]];i++){
        tmpstack.push(numstack.pop());
    }
    tmpstack.reverse();
    var retval=opProp[op][col["opFunc"]](...tmpstack);
    if(isMathError(retval)){
        halt=true;
        console.trace("Math ERROR",...tmpstack,op)
        memory["Status"]="Math ERROR"
    }
    if(memory["Mode"]=="cmplx"){
        if(isCmplx(retval)){
            numstack.push(retval);
        }else{
            numstack.push(new cmplx(retval));
        }
        return;
    }
    numstack.push(retval);
}

function clearforOperator(opstack,numstack,newop){
    var newprec=opProp[newop][col["opPrec"]];
    //If the new operator has lower precedence than the top operator in the stack, the old operator will be applied.
    //if(opstack.length) console.log(newprec,opProp[last(opstack)][col["opPrec"]])
    while(opstack.length>0&&
        (last(opstack)!="("||newop==")") &&
        (
            newprec<opProp[last(opstack)][col["opPrec"]]||
            (
                newprec==opProp[last(opstack)][col["opPrec"]]&&
                opProp[last(opstack)][col["leftFirst"]]
            )
        )
    ){
        var lastop=opstack.pop();
        applyToStack(numstack,lastop);
        if(halt) return;
        console.log(...numstack,lastop);
        if(lastop=="(")
            return;

    }
}

function expressionEval(expr){
    var addhandle="";
    if(expr.substr(-2)=="M+"||expr.substr(-2)=="M-"){
        addhandle=expr.substr(-2);
        expr=expr.substr(0,expr.length-2);
    }
    numstack=[];
    opstack=[];
    var lpcnt=0;
    var lastval=false;
    while(expr.length){
        console.log("Expression Left:",expr)
        //console.log(expr,/^[+-]?[0-9]*[.]?[0-9]*E?[0-9]+/.test(expr),isOperator(expr));
        var newop;
        if(/^[0-9]*[.]?[0-9]*E?[0-9]+/.test(expr)){
            if(memory["Mode"]=="cmplx"){
                numstack.push(new cmplx(parseFloat(expr)));
            }else{
                numstack.push(parseFloat(expr));
            }
            expr=expr.replace(/^[0-9]*[.]?[0-9]*E?[0-9]+/, '');
            lastval=true;
            console.log("Parsing num",numstack[numstack.length-1]);
        }else if(newop=isOperator(expr)){
            expr=expr.substr(newop.length);
            if(newop[0]=="+"&&!lastval)
                continue;
            if(newop[0]=="-"&&!lastval){
                opstack.push("neg");
                continue;
            }
            if(newop[0]=="ᴇ"&&!lastval){
                numstack.push(1);
            }

            if(opstack.length){
                //console.log(newprec,opProp[last(opstack)][col["opPrec"]])
            }
            clearforOperator(opstack,numstack,newop)
            if(halt) return;

            if(newop!="("||opProp[last(newop)][col["prefixFunc"]])
                while(opstack.length>0&&
                    opProp[last(opstack)][col["prefixFunc"]]
                ){
                    applyToStack(numstack,opstack.pop())
                    if(halt)
                        return;
                }
            if((opProp[newop][col["prefixFunc"]]||newop=="(")&&lastval){
                clearforOperator(opstack,numstack,"hmul")
                if(halt) return;
                opstack.push("hmul")
            }
            lastval=false;
            //If the operator is a suffix operator, apply it immediately
            if(opProp[newop][col["suffixOp"]]){
                lastval=true;
                applyToStack(numstack,newop);
                if(halt) return;
            }
            //If it is a close bracket, don't push it into the operator stack
            else if(newop!=")")
                opstack.push(newop)

            if(newop==")")
                lastval=true;
            console.log("Parsing op",opstack[opstack.length-1])
        }else if(newop=isVar(expr)){
            
            expr=expr.substr(newop.length);
            if(lastval){
                clearforOperator(opstack,numstack,"hmul")
                if(halt) return;
                opstack.push("hmul")
            }
            if(memory["Mode"]=="cmplx"){
                if(isCmplx(memory[newop])){
                    numstack.push(memory[newop]);
                }else{
                    numstack.push(new cmplx(memory[newop]));
                }
            }else{
                if(isCmplx(memory[newop])){
                    numstack.push(memory[newop].re);
                }else{
                    numstack.push(memory[newop]);
                }
            }
            lastval=true
            console.log("Parsing memory",newop,"with value:",memory[newop]);
        }else{
            memory["Status"]="SYNTAX ERROR";
            halt=true;
            console.log("Syntax ERROR");
            alert("SYNTAX ERROR");
            return;
        }
        console.log("Stack",...numstack,opstack)
        if(lpcnt++>500)break;
    }
    while(opstack.length){
        applyToStack(numstack,opstack.pop())
        console.log("Stack",...numstack,opstack)
        //console.log(halt)
        if(halt) return;
    }
    if(numstack.length>1){
        alert("SYNTAX ERROR")
        console.log("Syntax ERROR")
        halt=true;
        return;
    }
    if(addhandle!=""){
        if(isCmplx(numstack[0])){
            if(addhandle=="M+")
                memory["M"]=cmplx.add(new cmplx(memory["M"]),numstack[0]);
            if(addhandle=="M-")
                memory["M"]=cmplx.sub(new cmplx(memory["M"]),numstack[0]);
        }else{
            if(addhandle=="M+")
                memory["M"]=toNum(memory["M"])+numstack[0];
            if(addhandle=="M-")
                memory["M"]=toNum(memory["M"])-numstack[0];
        }
    }

    console.log("Stack",...numstack);
    return numstack[0];
}
