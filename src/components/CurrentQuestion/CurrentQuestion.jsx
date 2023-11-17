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
  const [timer, setTimer] = useState(3); // Countdown timer for each question
  const [quizStartTime, setQuizStartTime] = useState(null);

  useEffect(() => {
    const calculatedProgress = (currentQuestionIndex / questions.length) * 100;
    setProgress(calculatedProgress);

    const questionsContainer = document.querySelector('.questions-container');
    if (questionsContainer) {
      questionsContainer.classList.remove('fadeInDown');
      void questionsContainer.offsetWidth;
      questionsContainer.classList.add('fadeInDown');
    }

    setSelectedIncorrectly(false);
    setShowCorrectAnswerEffect(false);

    setTimer(6);
  }, [currentQuestionIndex, questions]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (!quizStartTime && currentQuestionIndex === 0) {
      setQuizStartTime(Date.now());
    }
  }, [currentQuestionIndex, quizStartTime]);

  // New useEffect to handle timer running out
  useEffect(() => {
    if (timer === 0 && !quizOver) {
      // Timer runs out, move to the next question
      dispatch(quiz.actions.goToNextQuestion());

      // Reset timer for the next question
      setTimer(6);
    }
  }, [timer, quizOver, dispatch]);

  const unansweredQuestions = questions
    .filter((_, index) => !answers.some((answer) => answer.question.id === index));

  const handleAnswerSubmit = (answerIndex) => {
    const isCorrect = questions[currentQuestionIndex].correctAnswerIndex === answerIndex;

    console.log('Is Correct:', isCorrect);

    if (isCorrect) {
      setShowCorrectAnswerEffect(true);
      console.log('Correct styling applied');

      setTimeout(() => {
        console.log('Correct styling removed');
        setShowCorrectAnswerEffect(false);

        dispatch(
          quiz.actions.submitAnswer({
            questionId: questions[currentQuestionIndex].id,
            answerIndex,
            isCorrect,
          })
        );

        dispatch(quiz.actions.incrementScore());

        if (currentQuestionIndex + 1 === questions.length) {
          dispatch(quiz.actions.quizOver());
        } else {
          dispatch(quiz.actions.goToNextQuestion());
        }
      }, 1500); // Adjust the delay as needed
    } else {
      setSelectedIncorrectly(true);

      console.log('Before setTimeout');
      setTimeout(() => {
        console.log('Inside setTimeout');
        console.log('Correct styling removed');
        setShowCorrectAnswerEffect(false);

        dispatch(
          quiz.actions.submitAnswer({
            questionId: questions[currentQuestionIndex].id,
            answerIndex,
            isCorrect,
          })
        );

        dispatch(quiz.actions.decrementScore());

        if (currentQuestionIndex + 1 === questions.length) {
          dispatch(quiz.actions.quizOver());
        } else {
          dispatch(quiz.actions.goToNextQuestion());
        }
      }, 1500); // Adjust the delay as needed
      console.log('After setTimeout');
    }
  };

  const question = questions[currentQuestionIndex];

  if (quizOver) {
    const correctAnswers = answers.filter((answer) => answer.isCorrect);
    const incorrectAnswers = answers.filter((answer) => !answer.isCorrect);

    // Use the score from the state
    return (
      <div className='summary-container'>
        <h1>Quiz Summary</h1>
        <p>Correct Answers: {correctAnswers.length}</p>
        <p>Incorrect Answers: {incorrectAnswers.length}</p>
        <p>Unanswered Questions: {unansweredQuestions.length}</p>
        <p>Your Score: {score}</p>
        {score < 4 ? (
          <p>Your score is below 4, you lost!</p>
        ) : (
          <p>Congratulations, you won!</p>
        )}
        <div>
          <h2>Questions to Practice:</h2>
          <ul>
            {incorrectAnswers.map((answer) => (
              <li key={answer.question.id}>{answer.question.questionText}</li>
            ))}
          </ul>
        </div>
        {unansweredQuestions.length > 0 && (
          <div>
            <h2>Unanswered Questions:</h2>
            <ul>
              {unansweredQuestions.map((question, index) => (
                <li key={index}>{question.questionText}</li>
              ))}
            </ul>
          </div>
        )}
        <button onClick={() => dispatch(quiz.actions.restart())}>
          Restart Quiz
        </button>
      </div>
    );
  }

  if (!question) {
    return <h1>Oh no! I could not find the current question!</h1>;
  }

  const { questionText, options, imageURL } = question;

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
        <p>Time Left: {timer} seconds</p>
        Question {currentQuestionIndex + 1} / {questions.length}
      </h1>
      <div className='content-container'>
        <div className='buttons-container'>
          <h2>{questionText}</h2>
          <ul>
            {options.map((option, index) => (
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
          <img src={imageURL} alt={`Question ${currentQuestionIndex + 1}`} />
        </div>
      </div>
    </div>
  );
};

