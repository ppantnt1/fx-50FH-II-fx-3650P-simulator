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
        "DRG":["°","ʳ","ᵍ"]
        //"SD/REG Mode": ["ClrStat", "FreqOn", "FreqOff", "Σx²", "Σx", "n", "Σy²", "Σy", "Σxy", "Σx²y", "Σx³", "Σx⁴", "x̄", "σx", "sx", "ȳ", "σy", "sy", "a", "b", "r", "x̂", "ŷ", "minX", "maxX", "minY", "maxY", ";", "DT"]
   }

const shortCut=[
    [/(->)/,"→"],
    [/(=>)/,"⇒"],
]

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

const modes=["comp","cmplx"]
var modecount=1;
var modeButton=document.getElementById("ModeButton");
function changeMode(){
    modecount++;
    modecount%=modes.length;
    modeButton.innerHTML=`Current Mode: ${modes[modecount]}`
    memory["Mode"]=modes[modecount];
}

window.addEventListener("load",function(){
    changeMode();
})

function exprng(){
    return Math.exp(Math.random()*460-230)
}

var memory={"A":exprng(),"B":exprng(),"C":exprng(),"D":exprng(),"X":exprng(),"Y":exprng(),"M":exprng(),"Ans":exprng(),"Display":true,"Mode":"comp","AngleMode":"deg","RoundMode":"Norm1"}
async function runCode(){
    halt=false;
    memory["Lbl"]={};
    var myField = document.getElementById("code")
    myField.value=myField.value.replace(/\s+/g,' ')
    for(var i in shortCut){
        myField.value=myField.value.replace(...shortCut[i])
    }
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
                await IOUIManager(`${code[memory['instrptr']-1]}`,memory["Ans"])
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
        //console.log(memory["instrptr"],code.length)
        //console.log(memory["Display"],code.length)
    }
}

const ctrlFlow=["Goto","Lbl",'While',"WhileEnd","If","Then","Else","IfEnd","For","To","Step","Next","Break"]

function last(arr){
    return arr[arr.length-1];
}

function until(conditionFunction) {

  const poll = resolve => {
    if(conditionFunction()) resolve();
    else setTimeout(_ => poll(resolve), 10);
  }

  return new Promise(poll);
}

async function ExecuteInstruction(instr,nesting=0){
    if(instr==undefined||instr.length==0)
        return;
    if(ctrlFlow.some(v=>instr.startsWith(v))){
        return ctrlFlowHandler(instr);
    }
    
    console.log(instr)
    var ind=instr.indexOf("⇒");
    if(ind!=-1){
        await ExecuteInstruction(instr.substr(0,ind),nesting+1);
        if(isCmplx(memory["Ans"])){
            console.log(cmplx.mul(memory["Ans"],cmplx.conjg(memory["Ans"])).re)
            if(cmplx.mul(memory["Ans"],cmplx.conjg(memory["Ans"])).re>=1e-28)
                await ExecuteInstruction(instr.substr(ind+1),nesting+1)
        }
        else if(memory["Ans"]*memory["Ans"]>=1e-28)
            await ExecuteInstruction(instr.substr(ind+1),nesting+1)
        
        return 0;
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
        if(isCmplx(memory["M"])){
            memory["M"]=cmplx.add(memory["M"],memory["Ans"]);
        }else{
            memory["M"]+=memory["Ans"];
        }
    }else{
        if(isCmplx(memory["M"])){
            memory["M"]=cmplx.sub(memory["M"],memory["Ans"]);
        }else{
            memory["M"]-=memory["Ans"];
        }
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

