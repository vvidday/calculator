
let payload = "0";
let current = "";
let pendingoperator = null;
let listening = false;
let finished = false;
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
    let answer = fn(parseFloat(x), parseFloat(y));
    return answer.toString();
}

function updateDisplay(){
    display.textContent = payload;
}

document.getElementById("clear-button").onclick = () => {
    payload = '0';
    current = "";
    listening = false;
    pendingoperator = null;
    finished = false;
    updateDisplay();
}


const numberButtons = document.querySelectorAll(".num");
numberButtons.forEach((button)=>{
    let content = button.textContent;
    button.addEventListener("click", (e)=>{
        if(finished){
            current = "";
            payload = content;
            updateDisplay();
            finshed = false;
        }
        else if(!listening){
            if(content == 0){
                if(payload != '0'){
                    payload += '0';
                }
            }
            else{
                if(payload == '0') payload = "";
                payload += content;
            }
            updateDisplay();
        }
        else{
            payload = content;
            updateDisplay();
            listening = false;
        }
    })
})

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
    button.addEventListener("click", (e)=>{
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
    })
})

const equalButton = document.getElementById("button-eq");
equalButton.addEventListener("click", (e)=>{
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
    }
})