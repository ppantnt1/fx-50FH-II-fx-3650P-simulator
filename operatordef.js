const operationList=[
    "+","-","×",'*',"÷","/","┘","(",")","^","%","ᴇ","√","cb√","ˣ√","⁻¹","²","³","sinh⁻¹","cosh⁻¹","tanh⁻¹","sinh","cosh","tanh","sin⁻¹","cos⁻¹","tan⁻¹","sin","cos","tan","=","≠",">","<","≧","≦"
];

const valSuffix=[
    "Ans","A","B","C","D","X","Y","M"
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
    "┘":     [3 ,fracdiv,2,true ,false,false],
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
    "tanh⁻¹":[9 ,atanh  ,1,false,false,true ]
}

const col={"opPrec":0,"opFunc":1,"opParam":2,"leftFirst":3,"suffixOp":4,"prefixFunc":5}

function neq(a,b){
    return (a!=b)?1:0;
}

function eq(a,b){
    return (a==b)?1:0;
}

function gt(a,b){
    return (a>b)?1:0;
}

function lt(a,b){
    return (a<b)?1:0;
}

function geq(a,b){
    return (a>=b)?1:0;
}

function leq(a,b){
    return (a<=b)?1:0;
}

function add(num1,num2){
    return num1+num2;
}

function sub(num1,num2){
    return num1-num2;
}

function mult(num1,num2){
    return num1*num2;
}

function neg(a){
    return -a;
}

function div(num1,num2){
    return num1/num2;
}

function fracdiv(num1,num2){
    return num1/num2;
}

function expA(a,b){
    console.log(a,b)
    return a*Math.pow(10,b);
}

function hold(num1){
    return num1;
}

function pow(a,b){
    return Math.pow(a,b);
}

function div100(a){
    return a/100;
}


function sqrt(a){
    return Math.sqrt(a);
}

function cbrt(a){
    return Math.cbrt(a);
}

function nthrt(a,b){
    return Math.pow(b,1/a);
}

function recip(a){
    return 1/a;
}

function sq(a){
    return a*a;
}

function cb(a){
    return a*a*a;
}

function sin(x){
    return Math.sin(x);
}

function cos(x){
    return Math.cos(x);
}

function tan(x){
    return Math.tan(x);
}

function asin(x){
    return Math.asin(x);
}

function acos(x){
    return Math.acos(x);
}

function atan(x){
    return Math.atan(x);
}

function sinh(x){
    return Math.sinh(x);
}

function cosh(x){
    return Math.cosh(x);
}

function tanh(x){
    return Math.tanh(x);
}

function asinh(x){
    return Math.asinh(x);
}

function acosh(x){
    return Math.acosh(x);
}

function atanh(x){
    return Math.atanh(x);
}
