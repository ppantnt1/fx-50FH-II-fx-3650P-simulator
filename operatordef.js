const operationList=[
    "+","-","×",'*',"÷","/","┘","(",")","^","%","ᴇ","cb√","ˣ√","√","⁻¹","²","³","sinh⁻¹","cosh⁻¹","tanh⁻¹","sinh","cosh","tanh","sin⁻¹","cos⁻¹","tan⁻¹","sin","cos","tan","=","≠",">","<","≧","≦","ln","log","°","ʳ","ᵍ","arg","Conjg","Abs","∠","!","Rnd",
];

const valSuffix=[
    "Ans","A","B","C","D","X","Y","M","π","e","i"
]

const opProp={
    "≠":     [1 ,neq    ,2,true ,false,false],
    "=":     [1 ,eq     ,2,true ,false,false],
    ">":     [1 ,gt     ,2,true ,false,false],
    "<":     [1 ,lt     ,2,true ,false,false],
    "≧":     [1 ,geq    ,2,true ,false,false],
    "≦":     [1 ,leq    ,2,true ,false,false],
    "+":     [2 ,add    ,2,true ,false,false],
    "-":     [2 ,sub    ,2,true ,false,false],
    "×":     [3 ,mult   ,2,true ,false,false],
    "*":     [3 ,mult   ,2,true ,false,false],
    "÷":     [3 ,div    ,2,true ,false,false],
    "/":     [3 ,div    ,2,true ,false,false],
    "┘":     [5 ,fracdiv,2,true ,false,false],
    "ᴇ":     [7 ,expA   ,2,true ,false,false],
    "(":     [9 ,hold   ,1,false,false,false],
    ")":     [0 ,hold   ,1,false,false,false],
    "neg":   [7 ,neg    ,1,false,true ,false],
    "hmul":  [5 ,mult   ,2,true ,false,false],
    "^":     [6 ,pow    ,2,false,false,false],
    "%":     [10,div100 ,1,false,true ,false],
    "√":     [9 ,sqrt   ,1,false,false,true ],
    "cb√":   [9 ,cbrt   ,1,false,false,true ],
    "ˣ√":    [9 ,nthrt  ,2,false,false,false],
    "⁻¹":    [10,recip  ,1,false,true ,false],
    "²":     [10,sq     ,1,false,true ,false],
    "³":     [10,cb     ,1,false,true ,false],
    "sin":   [9 ,sin    ,1,false,false,true ],
    "cos":   [9 ,cos    ,1,false,false,true ],
    "tan":   [9 ,tan    ,1,false,false,true ],
    "sin⁻¹": [9 ,asin   ,1,false,false,true ],
    "cos⁻¹": [9 ,acos   ,1,false,false,true ],
    "tan⁻¹": [9 ,atan   ,1,false,false,true ],
    "sinh":  [9 ,sinh   ,1,false,false,true ],
    "cosh":  [9 ,cosh   ,1,false,false,true ],
    "tanh":  [9 ,tanh   ,1,false,false,true ],
    "sinh⁻¹":[9 ,asinh  ,1,false,false,true ],
    "cosh⁻¹":[9 ,acosh  ,1,false,false,true ],
    "tanh⁻¹":[9 ,atanh  ,1,false,false,true ],
    "ln":    [9 ,ln     ,1,false,false,true ],
    "log":   [9 ,log    ,1,false,false,true ],
    "°":     [10,fromdeg,1,false,true ,false],
    "ʳ":     [10,fromrad,1,false,true ,false],
    "ᵍ":     [10,fromgra,1,false,true ,false],
    "Abs":   [9 ,abs    ,1,false,false,true ],
    "!":     [10,fact   ,1,false,true ,false],
    "Rnd":   [9,rnd    ,1,false,false,true ],

    //Cmplx Exclusive
    "∠":     [4 ,ang    ,2,true ,false,false],
    "arg":   [9 ,arg    ,1,false,false,true ],
    "Conjg": [9 ,conjg  ,1,false,false,true ],
}

const col={"opPrec":0,"opFunc":1,"opParam":2,"leftFirst":3,"suffixOp":4,"prefixFunc":5}

function epseq(a,b){
    return Math.abs(a-b)<1e-10;
}
function epsneq(a,b){
    return Math.abs(a-b)>=1e-10;
}
function neq(a,b){
    if(isCmplx(a)){
        return (epsneq(a.re,b.re)||epsneq(a.im!=b.im))?1:0;
    }
    return (epsneq(a,b))?1:0;
}

function eq(a,b){
    if(isCmplx(a)){
        return (a.re==b.re&&a.im==b.im)?1:0;
    }
    return (a==b)?1:0;
}

function gt(a,b){
    if((a instanceof cmplx)&&a.im!=0){
        halt=true;
        return 0;
    }
    return (a>b)?1:0;
}

function lt(a,b){
    if((a instanceof cmplx)&&a.im!=0){
        halt=true;
        return 0;
    }
    return (a<b)?1:0;
}

function geq(a,b){
    if((a instanceof cmplx)&&a.im!=0){
        halt=true;
        return 0;
    }
    return (a>=b)?1:0;
}

function leq(a,b){
    if((a instanceof cmplx)&&a.im!=0){
        halt=true;
        return 0;
    }
    return (a<=b)?1:0;
}

function add(a,b){
    if((a instanceof cmplx)){
        return cmplx.add(a,b)
    }
    return a+b;
}

function sub(a,b){
    if((a instanceof cmplx)){
        return cmplx.sub(a,b)
    }
    return a-b;
}

function mult(a,b){
    if((a instanceof cmplx)){
        return cmplx.mul(a,b)
    }
    return a*b;
}

function neg(a){
    if((a instanceof cmplx)){
        return cmplx.sub(new cmplx(0),a)
    }
    return -a;
}

function div(a,b){
    if((a instanceof cmplx)){
        return cmplx.div(a,b)
    }
    return a/b;
}

function fracdiv(a,b){
    if((a instanceof cmplx)){
        return cmplx.div(a,b)
    }
    return a/b;
}

function expA(a,b){
    if((a instanceof cmplx)&&(a.im!=0||b.im!=0)){
        halt=true;
        return 0;
    }else if(isCmplx(a)){
        a=a.re;
        b=b.re;
    }
    return a*Math.pow(10,b);
}

function hold(num1){
    return num1;
}

function pow(a,b){
    if(a instanceof cmplx){
        if(b.im){
            halt=true;
            return 0;
        }
        if(b.re==2){
            return cmplx.sq(a); 
        }
        if(b.re==3){
            return cmplx.cb(a); 
        }
        if(b.re==-1){
            return cmplx.inv(a);
        }
        if(a.im){
            halt=true;
            return 0;
        }
        return Math.pow(a.re,b.re);
    }
    return Math.pow(a,b);
}

function div100(a){
    //impossible
    if(a instanceof cmplx){
        return cmplx.div(a,new cmplx(100))
    }
    return a/100;
}


function sqrt(a){
    if(isCmplx(a)){
        if(a.im!=0){
            halt=true;
            return 0;
        }
        if(a.re>=0){
            return new cmplx(Math.sqrt(a.re))
        }
        return new cmplx(0,Math.sqrt(-a.re))
    }
    return Math.sqrt(a);
}

function cbrt(a){
    if(a instanceof cmplx){
        return new cmplx(Math.cbrt(a.re));
    }
    return Math.cbrt(a);
}

function nthrt(a,b){
    if((a instanceof cmplx)){
        if(b.im||a.im){
            halt=true;
            return 0;
        }
        if(a==2){
            return sqrt(b);
        }
        return Math.pow(b.re,1/a.re)
    }
    return Math.pow(b,1/a);
}

function recip(a){
    if(a instanceof cmplx){
        return cmplx.inv(a);
    }
    return 1/a;
}

function sq(a){
    if(a instanceof cmplx)
        return cmplx.sq(a);
    return a*a;
}

function cb(a){
    if(isCmplx(a))
        return cmplx.cb(a);
    return a*a*a;
}

function sin(x){
    if(x instanceof cmplx){
        if(x.im){
            halt=1;
            return 0;
        }
        x=x.re;
    }
    x=torad(x);
    return Math.sin(x);
}

function cos(x){
    if(x instanceof cmplx){
        if(x.im){
            halt=1;
            return 0;
        }
        x=x.re;
    }
    x=torad(x);
    return Math.cos(x);
}

function tan(x){
    if(x instanceof cmplx){
        if(x.im){
            halt=1;
            return 0;
        }
        x=x.re;
    }
    x=torad(x);
    return Math.tan(x);
}

function asin(x){
    if(x instanceof cmplx){
        if(x.im){
            halt=1;
            return 0;
        }
        x=x.re;
    }
    return fromrad(Math.asin(x));
}

function acos(x){
    if(x instanceof cmplx){
        if(x.im){
            halt=1;
            return 0;
        }
        x=x.re;
    }
    return fromrad(Math.acos(x));
}

function atan(x){
    if(x instanceof cmplx){
        if(x.im){
            halt=1;
            return 0;
        }
        x=x.re;
    }
    return fromrad(Math.atan(x));
}

function sinh(x){
    if(x instanceof cmplx){
        if(x.im){
            halt=1;
            return 0;
        }
        x=x.re;
    }
    return Math.sinh(x);
}

function cosh(x){
    if(x instanceof cmplx){
        if(x.im){
            halt=1;
            return 0;
        }
        x=x.re;
    }
    return Math.cosh(x);
}

function tanh(x){
    if(x instanceof cmplx){
        if(x.im){
            halt=1;
            return 0;
        }
        x=x.re;
    }
    return Math.tanh(x);
}

function asinh(x){
    if(x instanceof cmplx){
        if(x.im){
            halt=1;
            return 0;
        }
        x=x.re;
    }
    return Math.asinh(x);
}

function acosh(x){
    if(x instanceof cmplx){
        if(x.im){
            halt=1;
            return 0;
        }
        x=x.re;
    }
    return Math.acosh(x);
}

function atanh(x){
    if(x instanceof cmplx){
        if(x.im){
            halt=1;
            return 0;
        }
        x=x.re;
    }
    return Math.atanh(x);
}

function log(x){
    if(x instanceof cmplx){
        if(x.im){
            halt=1;
            return 0;
        }
        x=x.re;
    }
    return Math.log10(x);
}

function ln(x){
    if(x instanceof cmplx){
        if(x.im){
            halt=1;
            return 0;
        }
        x=x.re;
    }
    return Math.log(x);
}

function fromdeg(x){
    if(isCmplx(x))
        x=x.re;
    if(memory["AngleMode"]=="deg"){
        return x;
    }
    if(memory["AngleMode"]=="rad"){
        return x*memory["π"]/180;
    }
    return x*100/90;
}

function fromrad(x){
    if(isCmplx(x))
        x=x.re;
    if(memory["AngleMode"]=="deg"){
        return x/memory["π"]*180;
    }
    if(memory["AngleMode"]=="rad"){
        return x;
    }
    return x/memory["π"]*200;
}

function fromgra(x){
    if(isCmplx(x))
        x=x.re;
    if(memory["AngleMode"]=="deg"){
        return x/100*90
    }
    if(memory["AngleMode"]=="rad"){
        return x/200*memory["π"];
    }
    return x;
}

function torad(x){
    if(isCmplx(x))
        x=x.re;
    if(memory["AngleMode"]=="deg"){
        return x*memory["π"]/180;
    }
    if(memory["AngleMode"]=="rad"){
        return x;
    }
    return x*memory["π"]/200;
}

function arg(x){
    if(!isCmplx(x)){
        if(x==0)halt=true;
        return 0;
    }
    if(x.im==0&&x.re==0){
        halt=true;
        return 0;
    }
    return fromrad(Math.atan2(x.im,x.re));
}

function conjg(x){
    if(!isCmplx(x))
        return x;
    return new cmplx(x.re,-x.im);
}

function abs(x){
    if(isCmplx(x)){
        //console.log(cmplx.mul(x,cmplx.conjg(x)).re);
        return new cmplx(Math.sqrt(cmplx.mul(x,cmplx.conjg(x)).re));
    }
    return Math.sqrt(x*x);
}

function ang(a,b){
    if(a.im!=0||b.im!=0||!isCmplx(a)){
        halt=true;
        return 0;
    }
    return new cmplx(a.re*Math.cos(torad(b.re)),a.re*Math.sin(torad(b.re)))
}

function fact(a){
    if(isCmplx(a)){
        if(a.im){
            halt=true;
            return 0
        }
        a=a.re;
    }
    if(!Number.isInteger(a)){
        halt=true;
        return 0;
    }
    if(a<0){
        halt=true;
        return 0;
    }
    if(a==0)
        return 1;
    return a*fact(a-1);
}

function rnd(a){
    if(isCmplx(a)){
        console.log(a)
        return new cmplx(Math.round(a.re),Math.round(a.im))
    }
    return Math.round(a);

}
