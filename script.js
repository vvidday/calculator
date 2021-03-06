
let payload = "0";
let current = "";
let pendingoperator = null;
let listening = false;
let finished = false;
let activelistener = false;
const display = document.getElementById("display-text");

function add(x, y){
    return x + y;
}

function subtract(x, y){
    return x - y;
}

function multiply(x, y){
    return x*y;
}

function divide(x, y){
    if(y==0) return "ERROR";
    return x / y;
}

function operate(fn, x, y){
    let answer = fn(parseFloat(x), parseFloat(y)).toString();
    if(answer.length > 12){
        if(!answer.includes(".")) return "Too Large Number!";
        let tmp = answer.split(".");
        let decimalPlaces = 12 - tmp[0].length - 1;
        return (Math.round(parseFloat(answer)*Math.pow(10, decimalPlaces))/Math.pow(10, decimalPlaces)).toString();
    }
    return answer.toString();
}

function updateDisplay(){
    display.textContent = payload;
}

function toggleAnim(b){
    b.classList.add("highlighted");
    setTimeout(()=> b.classList.remove("highlighted"),100);
}


const clearButton = document.getElementById("clear-button");
clearButton.onclick = clear;
window.addEventListener("keydown", (key)=>{
    if(key.key == "Escape"){
        clear();
        toggleAnim(clearButton);
    }
})

function clear(){
    payload = '0';
    current = "";
    listening = false;
    pendingoperator = null;
    finished = false;
    if(!activelistener) toggleDec();
    updateDisplay();
}


const numberButtons = document.querySelectorAll(".num");
numberButtons.forEach((button)=>{
    button.addEventListener("click", ()=> numberPress(button.textContent));
    window.addEventListener("keydown", (key)=>{
        if(key.key == button.textContent){
            numberPress(button.textContent);
            toggleAnim(button);
        }
    })
})

function numberPress(content){
    if(payload.length > 12){ return;
    }
        else if(finished){
            current = "";
            payload = content;
            updateDisplay();
            finished = false;

        }
        else if(!listening){
            if(content == 0){
                if(payload != '0'){
                    payload += '0';
                }
            }
            else{
                if(payload === '0') payload = "";
                payload += content;
            }
            updateDisplay();
        }
        else{
            payload = content;
            updateDisplay();
            listening = false;
            if(!activelistener) toggleDec();
        }
}


const decButton = document.getElementById("button-decimal");
function dec(e){
    if(finished){
        current = "";
        payload = "0.";
        updateDisplay();
        finished = false;
    }
    else if(!listening){
        payload += ".";
        updateDisplay();
    }
    else{
        payload = "0.";
        updateDisplay();
        listening = false;
    }
    toggleDec();
}


function keydec(key){
    if(key.key == "."){ 
        dec();
        toggleAnim(decButton);
    };
}

function toggleDec(){
    if (!activelistener){
        decButton.addEventListener("click", dec);
        window.addEventListener("keydown", keydec);
        activelistener = true;
    }
    else{
        decButton.removeEventListener("click", dec);
        window.removeEventListener("keydown", keydec);
        activelistener = false;
    }
}




const opButtons = document.querySelectorAll(".op");
opButtons.forEach((button)=>{
    let t = button.id.replace("button-","");
    let f = null;
    switch(t){
        case "add":
            f = add;
            break;
        case "mult":
            f = multiply;
            break;
        case "divide":
            f = divide;
            break;
        case "minus":
            f = subtract;
    }
    button.addEventListener("click", (button)=> opEval(f));
})



window.addEventListener("keydown", (key)=>{
    switch(key.key){
        case "+":
            opEval(add);
            toggleAnim(opButtons[3]);
            break;
        case "-":
            opEval(subtract);
            toggleAnim(opButtons[2]);
            break;
        case "*":
            opEval(multiply);
            toggleAnim(opButtons[1]);
            break;
        case "/":
            opEval(divide);
            toggleAnim(opButtons[0]);
            break;
    }
})


function opEval(f){
    finished = false;
        if(!pendingoperator){
            pendingoperator = f;
            listening = true;
            current = payload;
            payload = '0';
        }
        else{
            payload = operate(pendingoperator, current, payload);
            if(payload == "ERROR") {
                updateDisplay();
            }
            else{
                updateDisplay();
                current = payload;
                payload = '0';
                pendingoperator = f;
                listening = true;
            }
        }
        if(!activelistener) toggleDec();
}


const equalButton = document.getElementById("button-eq");
equalButton.addEventListener("click", equaleval);
window.addEventListener("keydown", (key)=>{
    if (key.key == "Enter"){
        equaleval();
        toggleAnim(equalButton);
    }
})


function equaleval(){
    if(current && pendingoperator){
        payload = operate(pendingoperator, current, payload);
        if(payload == "ERROR"){
            updateDisplay();
        }
        else{
            updateDisplay();
            current = "";
            finished = true;
            pendingoperator = null;
        }
        if(!activelistener) toggleDec();
    }
}

const delButton = document.getElementById("del-button");
delButton.onclick = del;
window.addEventListener("keydown", (key)=>{
    if(key.key == "Backspace" || key.key == "Delete"){
        del();
        toggleAnim(delButton);
    }
})

function del(){
    if(payload === '0') return;
    if(payload.length == 1) payload = '0';
    else payload = payload.slice(0, payload.length - 1);
    updateDisplay();
}


toggleDec();