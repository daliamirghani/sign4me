const shuffle = (array) => { //Fisher–Yates shuffle algorithm
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); 
    [array[i], array[j]] = [array[j], array[i]]; 
  }
  return array;
}

const makeQuiz = (array, mode) => {
  const quiz = [];

  for (let i = 0; i < array.length; i++) {

    const options = shuffle([...array]).slice(0, 3);
    let question, choices = [], answer;
if (mode === 1) { // question is a word
  question = array[i].answer;

  let choices = options.map(item => item.signImage); // 3 random wrongs
  choices.push(array[i].signImage);                  // add the right answer
  choices = shuffle(choices);                     

  answer = array[i].signImage;

} else if (mode === 2) { // question is a sign
  question = array[i].signImage;

  let choices = options.map(item => item.answer); // 3 random wrongs
  choices.push(array[i].answer);                  // add the right answer
  choices = shuffle(choices);                   

  answer = array[i].answer;
}

    quiz.push({
      question,
      choices,
      answer
    });
  }

  return quiz;
};



module.exports = {
    shuffle,
    makeQuiz
};