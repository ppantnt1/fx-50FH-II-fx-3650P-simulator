function numToStr(a){
    return (""+a.toPrecision(10)).replace("e","ᴇ")
}

function cmplxToStr(a){
    if(a.im==0&&a.re==0)
        return "0";
    if(a.im==0)
        return numToStr(a.re);
    if(a.re==0)
        return `${numToStr(a.im)}i`
    if(a.im<0){
        return `${numToStr(a.re)}${numToStr(a.im)}i`;
    }
    return `${numToStr(a.re)}+${numToStr(a.im)}i`;
}


async function IOUIManager(line1,line2="",input=false){
    console.log(line2 instanceof cmplx)
    console.log(line2)
    var evinput=line2;
    if(isCmplx(line2)){
        line2=cmplxToStr(line2);
    }
    if(isNumber(line2)){
        line2=numToStr(line2);
    }
    messageField.innerHTML=line1;
    inputField.value=line2;
    if(input){
        inputField.removeAttribute("disabled","");
    }else
        inputField.setAttribute("disabled","");
    inputWindow.style.display="block";
    do{
        if(input){
            inputField.focus();
            inputField.selectionStart=0;
            inputField.selectionEnd=inputField.value.length;
        }
        responded=false;
        await until(()=>responded==true);
        if(halt){
            inputWindow.style.display="none";
            return [];
        }
        if(input&&inputField.value!=line2)
            evinput=expressionEval(inputField.value);
    }while(input&&inputField.value=="");
    inputWindow.style.display="none";


    return [evinput];
}

document.addEventListener("keypress", function(event) {
    if (event.key == "Enter") {
        responded=true;
    }
});

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
    //memory["Ans"]=input[0];
    if(input){
        memory[storeTo]=input[0];
    }
    return 0;
}
