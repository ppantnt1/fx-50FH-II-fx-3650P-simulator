const container = document.getElementById("container")
var inputWindow=document.getElementById("DisplayWindow")
var inputField=document.getElementById("input")
var messageField=document.getElementById("DisplayMessage")
var halt=false;
var responded=false;

const tokens =
    {
        "Programming": ["?", "→", ":", "◢", "⇒", "=", "≠", ">", "<", "≧", "≦", "Goto ", "Lbl ", "While ", "WhileEnd", "If ", "Then ", "Else ", "IfEnd", "For ", "To ", "Step ", "Next", "Break"],
        "Numbers": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⁻¹", "²", "³"],
        "Basic Operators": ["+", "-", "×", "÷", "┘", "(", ")", "^(", "%", "ᴇ", "√(", "cb√(", "ˣ√("],
        "Functions": ["sin(", "cos(", "tan(", "sin⁻¹(", "cos⁻¹(", "tan⁻¹(", "sinh(", "cosh(", "tanh(", "sinh⁻¹(", "cosh⁻¹(", "tanh⁻¹(", "log(", "ln(", "Rnd(", "Pol(", "Rec(", "Abs("],
        "Memory": ["A", "B", "C", "D", "X", "Y", "M", "M+", "M-", "ClrMemory", "Ans"],
        "Setup": ["Fix ", "Sci ", "Norm ", "Deg ", "Rad ", "Gra "],
        "Other": ["ℙ", "ℂ", ",", ";", "Ran#", "π"],
        "Complex Mode": ["i", "∠", ">r∠θ", ">a+bi", "arg(", "Conig("],
        //"SD/REG Mode": ["ClrStat", "FreqOn", "FreqOff", "Σx²", "Σx", "n", "Σy²", "Σy", "Σxy", "Σx²y", "Σx³", "Σx⁴", "x̄", "σx", "sx", "ȳ", "σy", "sy", "a", "b", "r", "x̂", "ŷ", "minX", "maxX", "minY", "maxY", ";", "DT"]
    }


i=0
for (let key in tokens) {
    container.innerHTML += `<small class="text-secondary">${key}</small><br>`
    for (let symbol of tokens[key]) {
        container.innerHTML += `<button onclick="append(this);" type="button" class="btn btn-secondary m-1">${symbol}</button>` 
    }
    container.innerHTML += '<br>'
}

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
async function runCode(){
    halt=false;
    memory["Lbl"]={};
    var myField = document.getElementById("code")
    myField.value=myField.value.replace(/\s+/g,' ')
    var codes=myField.value
    codes=codes.replaceAll("◢","◢:")
    codes=codes.replaceAll(" ","")
    console.log(codes)
    const code=codes.split(":")
    memory["instrptr"]=0
    memory["skipUntilMatch"]=""
    while(true){
        if(memory["instrptr"]>=code.length){
            if(memory["Display"]==false) 
                await IOUIManager(`${code[memory['instrptr']-1]}`,`${memory["Ans"]}`)
            return;
        }
        if(code[memory['instrptr']].length==0){
            memory["instrptr"]++;
            continue;
        }
        memory["Display"]=false;
        if(memory["skipUntilMatch"]==code[memory['instrptr']])
            memory["skipUntilMatch"]=""
        if(memory["skipUntilMatch"]=="")
            var retval=await ExecuteInstruction(code[memory['instrptr']])
        console.log(memory["Display"])
        if(halt)
            return 1;
        if(memory["Display"]==true)
            await IOUIManager(`${code[memory['instrptr']]}`,memory["Ans"]);
        if(halt)
            return 1;

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

function until(conditionFunction) {

  const poll = resolve => {
    if(conditionFunction()) resolve();
    else setTimeout(_ => poll(resolve), 400);
  }

  return new Promise(poll);
}

function applyToStack(numstack,op){
    var tmpstack=[];
    for(var i=0;i<opProp[op][col["opParam"]];i++){
        tmpstack.push(numstack.pop());
    }
    numstack.push(opProp[op][col["opFunc"]](...tmpstack.reverse()));
}

async function ExecuteInstruction(instr){
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
        return await inputHandler(storeTo);
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



function ctrlFlowHandler(instr){
    console.log("Control flow detected")
    if(instr.startsWith("Lbl")){
        if(instr.length!=4&&!/\d/.test(instr[3])){
            alert("Argument ERROR");
            console.log("Argument ERROR");
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
            return -1;
        }
        var pos=instr[4];
        if(pos in memory["Lbl"]){
            memory["instrptr"]=memory["Lbl"][pos];
            return 0;
        }
        memory["skipUntilMatch"]=`Lbl${pos}`
        return 0;

    }
}

async function IOUIManager(line1,line2="",input=false){
    console.log(line2)
    if(line2==parseFloat(line2)){
        line2=(""+line2).replace("e","ᴇ")
    }
    responded=false;
    messageField.innerHTML=line1;

    inputField.value=line2;
    if(input){
        inputField.removeAttribute("disabled","");
    }else
        inputField.setAttribute("disabled","");
    inputWindow.style.display="block";
    await until(()=>responded==true);
    inputWindow.style.display="none";

    if(halt)
        return [];

    var evinput=expressionEval(inputField.value);
    return [evinput];
}

function ac(){
    responded=true;
    halt=true;
}
function exe(){
    responded=true;
}

async function inputHandler(storeTo){
    console.log("Input detected")
    if(storeTo=="+"||storeTo=="-")
        return -1;
    do{
        //var input=window.prompt(`${storeTo}?`,memory[storeTo])
        var input=await IOUIManager(`${storeTo}?`,memory[storeTo],true);
        if(halt)
            return 1;
        //var selection = parseFloat(input);
    }while(input.length==0);
    memory["Ans"]=input[0];
    memory[storeTo]=input[0];
    return 0;
}
