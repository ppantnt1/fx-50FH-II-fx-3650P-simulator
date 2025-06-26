const container = document.getElementById("container")
const tokens =
    {
        "Programming": ["?", "→", ":", "◢", "⇒", "=", "≠", ">", "<", "≧", "≦", "Goto ", "Lbl ", "While ", "WhileEnd", "If ", "Then ", "Else ", "IfEnd", "For ", "To ", "Step ", "Next", "Break"],
        "Numbers": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⁻¹", "²", "³"],
        "Basic Operators": ["+", "-", "×", "÷", "┘", "(", ")", "^(", "%", "E", "√(", "³√(", "ˣ√("],
        "Functions": ["sin(", "cos(", "tan(", "sin⁻¹(", "cos⁻¹(", "tan⁻¹(", "sinh(", "cosh(", "tanh(", "sinh⁻¹(", "cosh⁻¹(", "tanh⁻¹(", "log(", "ln(", "Rnd(", "Pol(", "Rec(", "Abs("],
        "Memory": ["A", "B", "C", "D", "X", "Y", "M", "M+", "M-", "ClrMemory", "Ans"],
        "Setup": ["Fix ", "Sci ", "Norm ", "Deg ", "Rad ", "Gra "],
        "Other": ["ℙ", "ℂ", ",", ";", "Ran#", "π"],
        "Complex Mode": ["i", "∠", ">r∠θ", ">a+bi", "arg(", "Conig("],
        //"SD/REG Mode": ["ClrStat", "FreqOn", "FreqOff", "Σx²", "Σx", "n", "Σy²", "Σy", "Σxy", "Σx²y", "Σx³", "Σx⁴", "x̄", "σx", "sx", "ȳ", "σy", "sy", "a", "b", "r", "x̂", "ŷ", "minX", "maxX", "minY", "maxY", ";", "DT"]
    }

var tokencode={}

i=0
for (let key in tokens) {
    container.innerHTML += `<small class="text-secondary">${key}</small><br>`
    tokencode[key]=[]
    for (let symbol of tokens[key]) {
        container.innerHTML += `<button onclick="append(this);" type="button" class="btn btn-secondary m-1">${symbol}</button>` 
        tokencode[key].push(i++)
    }
    container.innerHTML += '<br>'
}

console.log(tokencode)
function append(myValue) {
    const myField = document.getElementById("code")
    var myChar=myValue.innerHTML
    if(myValue.innerHTML=="&lt;")
        myChar="<";
    if(myValue.innerHTML=="&gt;")
        myChar=">";
    if (document.selection) {
        myField.focus();
        sel = document.selection.createRange();
        sel.text = myChar;
    }
    else if (myField.selectionStart || myField.selectionStart == '0') {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        var txtaftercursor=myField.value.substring(endPos, myField.value.length);
        myField.focus();
        myField.value = myField.value.substring(0, startPos)
            + myChar;
        myField.value+=txtaftercursor
        myField.selectionStart=startPos+myChar.length;
        myField.selectionEnd=startPos+myChar.length;
    } else {
        myField.value += myChar;
    }
}

function exprng(){
    return Math.exp(Math.random()*460-230)
}

var memory={"A":exprng(),"B":exprng(),"C":exprng(),"D":exprng(),"X":exprng(),"Y":exprng(),"M":exprng(),"Ans":exprng(),"Display":true}
function runCode(){
    var myField = document.getElementById("code")
    myField.value=myField.value.replace(/\s/g,'')
    var codes=myField.value
    codes=codes.replaceAll("◢","◢:")
    console.log(codes)
    const code=codes.split(":")
    memory["instrptr"]=0
    while(true){
        if(memory["instrptr"]>=code.length){
            if(memory["Display"]==false) alert(`${code[memory['instrptr']-1]}\nEND\n${memory["Ans"]}`)
            return;
        }
        if(code[memory['instrptr']].length==0){
            memory["instrptr"]++;
            continue;
        }
        memory["Display"]=false;
        var retval=ExecuteInstruction(code[memory['instrptr']])
        if(memory["Display"]==true)
            alert(`${code[memory['instrptr']]}\n\n${memory["Ans"]}`);

        memory["instrptr"]++;
        console.log(memory["instrptr"],code.length)
        console.log(memory["Display"],code.length)
    }
    
}

const ctrlFlow=["Goto","Lbl",'While',"WhileEnd","If","Then","Else","IfEnd","For","To","Step","Next","Break"]

function last(arr){
    return arr[arr.length-1];
}

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
    numstack.push(opProp[op][col["opFunc"]](...tmpstack.reverse()));
}

function ExecuteInstruction(instr){
    if(instr==undefined||instr.length==0)
        return;
    if(ctrlFlow.some(v=>instr.includes(v))){
        ctrlFlowHandler(instr);
        return;
    }
    if(instr.substr(-1)=="◢"){
        memory["Display"]=true
        instr=instr.substr(0,instr.length-1);
    }
    var storeTo="Ans"
    if(new Set(["→A","→B","→C","→D","→X","→Y","→M","M+","M-"]).has(instr.substr(-2))){
        storeTo=instr.substr(-1);
        instr=instr.substr(0,instr.length-2);
    }

    if(instr=="?"){
        return inputHandler(storeTo);
    }
    memory["Ans"]=expressionEval(instr);
    if(storeTo!='+'&&storeTo!='-')
        memory[storeTo]=memory["Ans"];
    else if(storeTo=="+"){
        memory["M"]+=memory["Ans"];
    }else{
        memory["M"]-=memory["Ans"];
    }
    console.log("Store to",storeTo,memory[storeTo])
    return 0;
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
            var newprec=opProp[newop][col["opPrec"]];
            expr=expr.substr(newop.length);
            if(newop[0]=="+"&&!lastval)
                continue;
            if(newop[0]=="-"&&!lastval){
                opstack.push("neg");
                continue;
            }

            if(opstack.length){
                //console.log(newprec,opProp[last(opstack)][col["opPrec"]])
            }

            //If the new operator has lower precedence than the top operator in the stack, the old operator will be applied.
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
                var lastop=opstack.pop()
                applyToStack(numstack,lastop)
                if(lastop=="(")
                    break;

            }
            if(newop!="(")
                while(opstack.length>0&&
                    opProp[last(opstack)][col["prefixFunc"]]
                ){
                    applyToStack(numstack,opstack.pop())
                }
            if((opProp[newop][col["prefixFunc"]]||newop=="(")&&lastval){
                opstack.push("hmul")
            }
            lastval=false;
            //If the operator is a suffix operator, apply it immediately
            if(opProp[newop][col["suffixOp"]])
                applyToStack(numstack,newop);
            //If it is a close bracket, don't push it into the operator stack
            else if(newop!=")")
                opstack.push(newop)

            if(newop==")")
                lastval=true;
            console.log("Parsing op",opstack[opstack.length-1])
        }else if(newop=isVar(expr)){
            
            expr=expr.substr(newop.length);
            numstack.push(memory[newop]);
            if(lastval)
                opstack.push("hmul")
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
    }
    console.log("Stack",numstack);
    return numstack[0];
}

function ctrlFlowHandler(instr){
    console.log("Control flow detected")
};

function inputHandler(storeTo){
    console.log("Input detected")
    if(storeTo=="+"||storeTo=="-")
        return -1;
    do{
        var selection = parseFloat(window.prompt(`${storeTo}?`,memory[storeTo]));
    }while(isNaN(selection));
    memory[storeTo]=selection
}
