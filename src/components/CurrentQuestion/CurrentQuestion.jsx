import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { quiz } from '../../reducers/quiz';
import './style.css';

export const CurrentQuestion = () => {
  const dispatch = useDispatch();
  const { currentQuestionIndex, quizOver, questions, answers, score } =
    useSelector((state) => state.quiz);

  const [selectedIncorrectly, setSelectedIncorrectly] = useState(false);
  const [showCorrectAnswerEffect, setShowCorrectAnswerEffect] = useState(false);
  const [progress, setProgress] = useState(0);

useEffect(() => {
  const calculatedProgress = (currentQuestionIndex / questions.length) * 100;
  setProgress(calculatedProgress);

  // Check if the questions container is available
  const questionsContainer = document.querySelector('.questions-container');
  if (questionsContainer) {
    // Reset the fadeInDown animation and selectedIncorrectly state on each question change
    questionsContainer.classList.remove('fadeInDown');
    void questionsContainer.offsetWidth; // Trigger reflow
    questionsContainer.classList.add('fadeInDown');
  }

  setSelectedIncorrectly(false);

  // Reset the correct answer effect state
  setShowCorrectAnswerEffect(false);
}, [currentQuestionIndex]);


  if (quizOver) {
    const correctAnswers = answers.filter((answer) => answer.isCorrect);
    const incorrectAnswers = answers.filter((answer) => !answer.isCorrect);

    // Use the score from the state
    return (
      <div className='summary-container'>
        <h1>Quiz Summary</h1>
        <p>Correct Answers: {correctAnswers.length}</p>
        <p>Incorrect Answers: {incorrectAnswers.length}</p>
        {score < 4 ? (
          <p>Your score is below 4, you lost!</p>
        ) : (
          <p>Congratulations, you won!</p>
        )}
        <button onClick={() => dispatch(quiz.actions.restart())}>
          Restart Quiz
        </button>
      </div>
    );
  }

  const question = questions[currentQuestionIndex];

  if (!question) {
    return <h1>Oh no! I could not find the current question!</h1>;
  }

  const handleAnswerSubmit = (answerIndex) => {
    const isCorrect = question.correctAnswerIndex === answerIndex;
    setSelectedIncorrectly(!isCorrect); // Update state based on correctness
  
    if (isCorrect) {
      // Show correct answer effect for a brief moment
      setShowCorrectAnswerEffect(true);
      setTimeout(() => setShowCorrectAnswerEffect(false), 500); // Adjust duration as needed
    }
  
    dispatch(
      quiz.actions.submitAnswer({
        questionId: question.id,
        answerIndex,
        isCorrect,
      })
    );
  
    dispatch(quiz.actions.goToNextQuestion());
  
    // Check if it's the last question to end the quiz
    if (currentQuestionIndex + 1 === questions.length) {
      dispatch(quiz.actions.quizOver()); // Dispatch the action to end the quiz
    }
  };    

  console.log(score);

  return (
    <div
      key={currentQuestionIndex}
      className={`questions-container ${
        selectedIncorrectly ? 'incorrect' : ''
      } ${showCorrectAnswerEffect ? 'correct-answer-effect' : ''} fadeInDown`}
    >
      <div className='progress-container'>
        <div className='progress-bar' style={{ width: `${progress}%` }}></div>
      </div>
      <h1>
        <p>Score: {score}</p>
        Question {currentQuestionIndex + 1} / {questions.length}
      </h1>
      <div className='content-container'>
        <div className='buttons-container'>
          <h2>{question.questionText}</h2>
          <ul>
            {question.options.map((option, index) => (
              <li key={index}>
                <button
                  className={`${
                    selectedIncorrectly && index === question.correctAnswerIndex
                      ? 'correct-answer'
                      : ''
                  }`}
                  onClick={() => handleAnswerSubmit(index)}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className='image-container'>
          <img
            src={question.imageURL}
            alt={`Question ${currentQuestionIndex + 1}`}
          />
        </div>
      </div>
    </div>
  );
};
