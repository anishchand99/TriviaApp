const categories = {
          '' : '',
          'General Knowledge' : '9',
          'Film' : '11',
          'Music' : '12',
          'Science & Nature' : '17',
          'Sports' : '21',
          'Geography' : '22',
          'History' : '23',
          'Celebrities' : '26',
          'Animals' : '27',
}
let category;
let question;
let difficulty;
let optionA, optionB, optionC, optionD;
let answer;

let categoryTypeElement = document.getElementById('category-type');
let difficultyLevelElement = document.getElementById('difficulty-type');
let questionCountElement = document.getElementById('question-count');
let categoryType; 
let difficultyLevel;
let questionCount; 

let totalQeus;
let totalCorrect = 0;
let totalScore = 0;

let questionText = document.querySelector('.questionText');
let optionAText = document.querySelector('.optionA');
let optionBText = document.querySelector('.optionB');
let optionCText = document.querySelector('.optionC');
let optionDText = document.querySelector('.optionD');
let currentScoreElement = document.getElementById('currentScore'); 
let pointValueElement = document.getElementById('pointValue');
let resultElement = document.querySelector('.result');
let request;

startQuiz = () => {
          let mainScreen = document.querySelector('.mainScreen');
          let introScreen = document.querySelector('.introScreen');
          categoryType = categories[categoryTypeElement.value];
          difficultyLevel = difficultyLevelElement.value;
          questionCount = questionCountElement.value;
          totalQeus = questionCount;
          request = `https://opentdb.com/api.php?amount=1&category=${categoryType}&difficulty=${difficultyLevel}&type=multiple`;
          introScreen.style.display = 'none';
          mainScreen.style.display = 'block';
          fetchQuestion();
}

fetchQuestion = () => {
          fetch(request)
          .then(res => res.json())
          .then(data => (buildQuestion(data.results[0])))
}

buildQuestion = questionObj => {
          category = questionObj.category;
          difficulty = questionObj.difficulty;
          //allocate points to the question based on the difficulty
          allocatePoints(difficulty);
          //question from the api has HTML characters like &quot
          let rawQuestion = questionObj.question;
          question = decodeHTML(rawQuestion);
          questionText.textContent = question;

          let rawAnswer = questionObj.correct_answer;
          answer = decodeHTML(rawAnswer);
          //answers => list of shuffled options
          let answers = shuffleOptions(questionObj.correct_answer, questionObj.incorrect_answers);
          assignOptions(answers);
}
allocatePoints= (difficulty) =>{
          if(difficulty === 'easy'){
                    pointValueElement.textContent = 5;  
          }
          else if(difficulty === 'medium'){
                    pointValueElement.textContent = 10;
          }
          else if(difficulty === 'hard'){
                    pointValueElement.textContent = 15;
          }
}
decodeHTML = (rawQuestion) => {
          let question = document.createElement('textarea');
          question.innerHTML = rawQuestion;        
          return question.value;
}
shuffleOptions = (correctAnswer, incorrectAnswers) => {
          options = [decodeHTML(correctAnswer), decodeHTML(incorrectAnswers[0]), decodeHTML(incorrectAnswers[1]), decodeHTML(incorrectAnswers[2])];
          answers = shuffle(options);
          return answers;
}
shuffle = (array) => {
          let currIndex = array.length;
          let tempValue;
          while(currIndex !== 0){
                    const randIndex = Math.floor(Math.random() * currIndex);
                    currIndex--;
                    tempValue = array[currIndex];
                    array[currIndex] = array[randIndex];
                    array[randIndex] = tempValue;
          }          
          return array;
}
assignOptions = (answers) => {
          optionAText.innerHTML = `<span>A.</span> ${answers[0]}`;
          optionBText.innerHTML = `<span>B.</span> ${answers[1]}`;
          optionCText.innerHTML = `<span>C.</span> ${answers[2]}`;
          optionDText.innerHTML = `<span>D.</span> ${answers[3]}`;
}

disableButtons = (bool) => {
          optionAText.disabled =bool;
          optionBText.disabled =bool;
          optionCText.disabled =bool;
          optionDText.disabled =bool;
}

checkAnswer = (choice) => {
          let optionNumber = choice.className;    
          let optionElement = document.querySelector(`.${optionNumber}`);
          let userChoice = extractAnswer(optionElement.textContent);
          disableButtons(true);
          if(userChoice === answer){
                    resultElement.textContent = 'It is the CORRECT answer!!!';
                    scorePoints('correct');
          } else{
                    resultElement.textContent = `WRONG!!!. The right answer was ${answer}.`
                    scorePoints('incorrect');
          }
}

//given the answer in the form 'A. Apple' return 'Apple'
extractAnswer = (answerPhrase) =>{
          let answer = answerPhrase.slice(3);
          return answer;
}

//assign the points to total points if correct
scorePoints = (outcome) => {
          if(outcome === 'correct'){
                    totalCorrect++;
                    totalScore = parseInt(currentScoreElement.textContent) + parseInt(pointValueElement.textContent);
                    currentScoreElement.textContent = totalScore;
          }
}
retrieveHighScore = (totalScore) => {
          console.log(window.localStorage.getItem('highScore'))
          let highScore = document.querySelector('.highScore');
          if(window.localStorage.getItem('highScore') != null && window.localStorage.getItem('highScore') < totalScore){
                    window.localStorage.setItem('highScore', `${totalScore}`);
                    highScore.textContent = totalScore; 
          }
          console.log(window.localStorage.getItem('highScore'))
          highScore.textContent = 'Highest Score:  ' + window.localStorage.getItem('highScore');

}
printResults = () =>{
          let mainScreen = document.querySelector('.mainScreen');
          let endScreen = document.querySelector('.endScreen');
          let totalPointsReceived = document.querySelector('.totalPointsReceived');
          let totalCorrectAnswers = document.querySelector('.totalCorrectAnswers');
          let totalQuestionsAsked = document.querySelector('.totalQuestionsAsked');
          mainScreen.style.display = 'none';
          endScreen.style.display = 'block';
          totalQuestionsAsked.textContent = 'Total Questions Asked: ' + totalQeus;
          totalCorrectAnswers.textContent = 'Total Correct Answers: ' + totalCorrect;
          totalPointsReceived.textContent = 'Total Points Scored: ' + totalScore;
          retrieveHighScore(totalScore);
}

nextQuestion = () => {
          if(questionCount > 1) {
                    questionCount--;
                    disableButtons(false);
                    resultElement.textContent = ``;
                    fetchQuestion();         
          }else {
                    printResults();
          }
}