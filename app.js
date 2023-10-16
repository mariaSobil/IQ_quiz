(function (){
    //all the elements I used
    const baseURL = 'https://opentdb.com/api.php?amount=1';
    const containerEl = document.querySelector('.container');
    const form = document.querySelector('#quiz_form');
    const questionEl = document.querySelector('.question');
    const optionEl = document.querySelector('.all_options');
    const buttonEl = document.querySelector('.buttons');
    const ScoreEl = document.querySelector('.scoreBoard .score-number');
    const answeredEl = document.querySelector('.scoreBoard .answered-number');
    
    let question, answer;
    let options =[];
    let score = 0;
    let answeredQuestion = 0;
    
    
    window.addEventListener("DOMContentLoaded", () =>{
        quizApp();
    });
       
    async function quizApp(){
    addPlaceHolder();
    updateScoreBoard();  
     const data = await fetchQuiz();
     question = data[0].question;
     options = [];
     answer = data[0].correct_answer;
     data[0].incorrect_answers.map((item) => options.push(item));
     options.splice(Math.floor(Math.random() * options.length +1), 0, answer);
     //console.log(answer)
      generateTemplate(question, options);
        }
        
        form.addEventListener("submit", (e)=>{
        e.preventDefault();
    
        if (e.target.quiz.value){
            checkQuiz(e.target.quiz.value);
            e.target.querySelector("button").style.display = "none";
            generateButtons();
        }else{
        return
        }
    } );   
    
    
    //fetchQuiz getting data from the baseURL and turning the data into JSON.
    async function fetchQuiz(){
    const response = await fetch(baseURL);
    const data = await response.json();
    //console.log(data);
    return data.results;
    }
    //generateTemplate loading up the questions, options and answers after removing Placeholder
    function generateTemplate(question, options, answer){  
        removePlaceholder(); 
        optionEl.innerHTML='';
        questionEl.innerHTML = question;
        options.map(( option, index) =>{
        const item = document.createElement("div");
        item.classList.add("option");
        item.innerHTML= `
        <input type="radio" id="option${index + 1}" value="${option}" name="quiz">
        <label for="option${index + 1}">${option}</label> 
        `;
        optionEl.appendChild(item);
        }
            );
    }
    
    function checkQuiz(selected){
        //console.log(selected, answer)
        answeredQuestion++;
        if (selected === answer){
            score++;
        
        updateScoreBoard();
        form.quiz.forEach((input) =>{
         if(input.value === answer) {
            input.parentElement.classList.add("correct");
         }
        } 
        );
    
    } else {
        updateScoreBoard();
        form.quiz.forEach((input) => {
        if (input.value === answer) {
            input.parentElement.classList.add("correct");
            //console.log(input)
        }
        });
    }
    }
    
    
    function updateScoreBoard(){
        ScoreEl.innerText = score;
        answeredEl.innerText = answeredQuestion;
    }
     function generateButtons(){
        const finishBtn = document.createElement('button');
        finishBtn.innerText = 'Finish';
        finishBtn.setAttribute('type', 'button');
        finishBtn.classList.add('finish-btn');
        buttonEl.appendChild(finishBtn)
    
        const nextBtn = document.createElement('button');
        nextBtn.innerText = 'Next Question';
        nextBtn.setAttribute('type', 'button');
        nextBtn.classList.add('next-btn');
        buttonEl.appendChild(nextBtn);
    
        finishBtn.addEventListener('click', finishQuiz);
        nextBtn.addEventListener('click', getNextQuiz);
    }
    
    function getNextQuiz(){
        const nextBtn = document.querySelector('.next-btn');
        const finishBtn = document.querySelector('.finish-btn');
    
        buttonEl.removeChild(nextBtn);
        buttonEl.removeChild(finishBtn);
    
        buttonEl.querySelector('button[type="submit"]').style.display = 'block'
        quizApp();
    }
    
    function finishQuiz(){
        const nextBtn = document.querySelector('.next-btn');
        const finishBtn = document.querySelector('.finish-btn');
    
        buttonEl.removeChild(nextBtn);
        buttonEl.removeChild(finishBtn);
        buttonEl.querySelector('button[type="submit"]').style.display = 'block'
    
        const overlay = document.createElement('div');
        overlay.classList.add('result-overlay');
        
        overlay.innerHTML = `
        <div class="final-result">${score}/${answeredQuestion}</div>
        <button> Play Again!</button>
        `
    containerEl.appendChild(overlay);
    overlay.querySelector('button').addEventListener('click', ()=>{
        containerEl.removeChild(overlay);
        playAgain();
    });
    }
    
    function playAgain(){
        score=0;
        answeredQuestion=0;
    //console.log('test')
        quizApp();
    }
    
     function addPlaceHolder(){
        const placeholder = document.createElement('div');
        placeholder.classList.add('placeholder');
        containerEl.appendChild(placeholder);
    
    }
    
    function removePlaceholder() {
        const placeholderEl = document.querySelector(".container .placeholder")
        containerEl.removeChild(placeholderEl);
    }
    
    }) ();
    
    
    