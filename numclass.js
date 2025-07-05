//define constants
window.addEventListener('load',function(){
    memory=Object.assign({},memory,constants)
})

class cmplx{
    constructor(a=0,b=0){
        this.re=a;
        this.im=b;
    }
    static add(a,b){
        return new cmplx(a.re+b.re,a.im+b.im);
    }
    static sub(a,b){
        return new cmplx(a.re-b.re,a.im-b.im);
    }
    static mul(a,b){
        return new cmplx(a.re*b.re-a.im*b.im,a.re*b.im+a.im*b.re);
    }
    static inv(a){
        return new cmplx(a.re/(a.re*a.re+a.im*a.im),-a.im/(a.re*a.re+a.im*a.im));
    }
    static div(a,b){
        return cmplx.mul(a,cmplx.inv(b));
    }
    static sq(a){
        return cmplx.mul(a,a);
    }
    static cb(a){
        return cmplx.mul(a,cmplx.sq(a));
    }
    static conjg(a){
        return new cmplx(a.re,-a.im)
    }
};
var constants={
    "e":2.71828182845904523536,
    "π":3.14159265358979323846,
    "i":new cmplx(0,1),
   
}

class numPair{
    constructor(a,b){
        this.a=a;
        this.b=b;
    }

}

function isNumber(value) {
  return typeof value === 'number';
}

function isCmplx(value){
    return value instanceof cmplx;
}

function isMathError(value){
    if(isCmplx(value)){
        if(isNaN(value.re)||isNaN(value.im))
            return true;
        if(Math.abs(value.re)>=1e100||Math.abs(value.im)>=1e100)
            return true;
        return false;
    }
    if(isNaN(value))
        return true;
    if(Math.abs(value)>=1e100)
        return true;
    return false;
    
}

function neq0(val){
    
    if(isCmplx(val)){
        if(cmplx.mul(val,cmplx.conjg(val)).re>=1e-28)
            return true;
    }   
    else if(val*val>=1e-28)
        return true;

    return false;
}
