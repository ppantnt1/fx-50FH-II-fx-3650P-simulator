function clearforOperator(opstack,numstack,newop){
    var newprec=opProp[newop][col["opPrec"]];
    //If the new operator has lower precedence than the top operator in the stack, the old operator will be applied.
    if(opstack.length) console.log(newprec,opProp[last(opstack)][col["opPrec"]])
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
        console.log(numstack,lastop);
        if(lastop=="(")
            return;

    }
}

function expressionEval(expr){
    numstack=[];
    opstack=[];
    var lpcnt=0;
    var lastval=false;
    while(expr.length){
        console.log(expr,/^[+-]?[0-9]*[.]?[0-9]*E?[0-9]+/.test(expr),isOperator(expr));
        var newop;
        if(/^[0-9]*[.]?[0-9]*E?[0-9]+/.test(expr)){
            numstack.push(parseFloat(expr));
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
            if(newop=="")

            if(newop!="(")
                while(opstack.length>0&&
                    opProp[last(opstack)][col["prefixFunc"]]
                ){
                    applyToStack(numstack,opstack.pop())
                }
            if((opProp[newop][col["prefixFunc"]]||newop=="(")&&lastval){
                clearforOperator(opstack,numstack,"hmul")
                opstack.push("hmul")
            }
            lastval=false;
            //If the operator is a suffix operator, apply it immediately
            if(opProp[newop][col["suffixOp"]]){
                lastval=true;
                applyToStack(numstack,newop);
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
                opstack.push("hmul")
            }
            numstack.push(memory[newop]);
            lastval=true
            console.log("Parsing memory",newop,"with value:",memory[newop]);
        }else{
            console.log("SYNTAX ERROR")
            alert("SYNTAX ERROR")
            return;
        }
        console.log("Stack",numstack,opstack)
        if(lpcnt++>50)break;
    }
    while(opstack.length){
        applyToStack(numstack,opstack.pop())
    }
    if(numstack.length>1){
        alert("SYNTAX ERROR")
        return;
    }
    console.log("Stack",numstack);
    return numstack[0];
}
