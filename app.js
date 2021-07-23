let count=0;
const question = document.getElementById('q');
const answer1 = document.getElementById('ans1');
const answer2  = document.getElementById('ans2');
const answer3  = document.getElementById('ans3');
const answer4  = document.getElementById('ans4');
const submit = document.getElementById('submit');
const clear = document.getElementById('clear');
const next = document.getElementById('next');
const btn1 = document.getElementById('btn1');
const btn2 = document.getElementById('btn2');
const btn3 = document.getElementById('btn3');
const btn4 = document.getElementById('btn4');
let quizData;
let currentAnswer;
let currentButton;
let correctButton;
let index;
let arr =[];
const currScore = document.getElementById('correct');
const outOfScore = document.getElementById('total');
let current=0;
let outOf=0;


const requestData = async () => {
    const response = await fetch('https://opentdb.com/api.php?amount=10&category=17&difficulty=easy&type=multiple');
    const data = await response.json();
    let quizData = data.results;
    return quizData;
}
const setCorrectButton= (index)=>{
    if(index===0) correctButton = btn1;
    else if(index===1) correctButton = btn2;
    else if(index===2) correctButton = btn3;
    else correctButton = btn4;
}

const setQuizInstance = () =>{
    if(count===9){
        next.textContent="RELOAD";
    }
    submit.disabled=true;
    arr = quizData[count]["incorrect_answers"];
    index = Math.floor(Math.random() * arr.length);
    setCorrectButton(index);
    arr.splice(index,0,quizData[count]["correct_answer"]);
    question.innerHTML = quizData[count]["question"]; 
    answer1.innerHTML = arr[0];
    answer2.innerHTML = arr[1];
    answer3.innerHTML = arr[2];
    answer4.innerHTML = arr[3];
}

const removePointer = () =>{
    btn1.style.pointerEvents = "none"; 
    btn2.style.pointerEvents = "none"; 
    btn3.style.pointerEvents = "none"; 
    btn4.style.pointerEvents = "none"; 
}

const verifyAnswer = () =>{
    if(currentAnswer == quizData[count]["correct_answer"])
    {
        currentButton.style.backgroundColor = "green";
    }
    else{
        correctButton.style.backgroundColor = "green";
        currentButton.style.backgroundColor="red";
    }
}
const updateScore = () =>{
    if(currentButton.style.backgroundColor == "green"){
        current++;
    }
    outOf++;
    currScore.textContent=current;
    outOfScore.textContent=outOf;
}
const resetQuiz = () =>{
    btn1.style.pointerEvents = "auto"; 
    btn1.style.backgroundColor="transparent";
    btn2.style.pointerEvents = "auto";  
    btn2.style.backgroundColor="transparent";
    btn3.style.pointerEvents = "auto";  
    btn3.style.backgroundColor="transparent";
    btn4.style.pointerEvents = "auto";
    btn4.style.backgroundColor="transparent";
    next.style.pointerEvents="none";  
}

async function main(){
    quizData = await requestData();
    setQuizInstance();
    submit.disabled=true;
    next.disabled=true;
}
main();


submit.addEventListener("click",()=>{
    verifyAnswer();
    removePointer();
    updateScore();
    next.style.pointerEvents="auto";
    next.disabled=false;
    clear.disabled=true;
});
btn1.addEventListener("click",()=>{
    currentAnswer = answer1.innerHTML;
    currentButton=btn1;
    submit.disabled=false;
});
btn2.addEventListener("click",()=>{
    currentAnswer = answer2.innerHTML;
    currentButton=btn2;
    submit.disabled=false;
});
btn3.addEventListener("click",()=>{
    currentAnswer = answer3.innerHTML;
    currentButton=btn3;
    submit.disabled=false;
});
btn4.addEventListener("click",()=>{
    currentAnswer = answer4.innerHTML;
    currentButton=btn4;
    submit.disabled=false;
});
next.addEventListener("click",()=>{
    if(count===9){
        Confirm.open({
            title: "Reload Quiz",
            message: "Click OK to confirm Reload",
            okText: "OK",
            cancelText:"Cancel",
            onok: function(){
                window.location.reload();
            },
            oncancel: ()=>console.log('You Pressed Cancel.')
        });
    }
    count++;
    setQuizInstance();
    resetQuiz();
});
clear.addEventListener("click",()=>{
    currentAnswer = "";
    submit.disabled=true;
});


const Confirm = {
    open(options){
        options = Object.assign({}, {
            title: "",
            message: "",
            okText: "",
            cancelText:"",
            onok: function(){
                window.location.reload();
            },
            oncancel: function(){}
        },options);
        

        const html = `
            <div class="confirm">
            <div class="confirm-window">
                <div class="black-top">${options.title}</div>
                <div class="confirm-msg">${options.message}</div>
                <div class="btn-box">
                    <button class="btn-confirm" id="ok">${options.okText}</button>
                    <button class="btn-cancel" id="cancel">${options.cancelText}</button>
                </div>
            </div>
        </div>
    `;

    const template = document.createElement('template');
    template.innerHTML = html;

    // Elements
    const confirmElement = template.content.querySelector('.confirm');
    const btnOk = template.content.getElementById("ok");
    const btnCancel = template.content.getElementById("cancel");

    confirmElement.addEventListener('click',e=>{
        if(e.target===confirmElement){
            options.oncancel();
            this._close(confirmElement);
            count--;
        }
    });

    btnOk.addEventListener("click", ()=>{
        this._close(confirmElement);
        options.onok();
    });

    btnCancel.addEventListener('click', ()=>{
        options.oncancel();
        this._close(confirmElement);
        count--;
    });

    document.body.appendChild(template.content);
    },

    _close(confirmElement){
        confirmElement.classList.add('confirm-close');
        
        
        confirmElement.addEventListener('animationend', ()=>{
            document.body.removeChild(confirmElement);
        });
    }
}