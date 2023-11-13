// components/CurrentQuestion.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { quiz } from "../../reducers/quiz";
import './style.css';

export const CurrentQuestion = () => {
  const dispatch = useDispatch();
  const { currentQuestionIndex, quizOver, questions, answers } = useSelector(
    (state) => state.quiz
  );

  useEffect(() => {
    // Reset the fadeInDown animation on each question change
    const questionsContainer = document.querySelector(".questions-container");
    questionsContainer.classList.remove("fadeInDown");
    void questionsContainer.offsetWidth; // Trigger reflow
    questionsContainer.classList.add("fadeInDown");
  }, [currentQuestionIndex]);

  if (quizOver) {
    const correctAnswers = answers.filter((answer) => answer.isCorrect);
    const incorrectAnswers = answers.filter((answer) => !answer.isCorrect);

    return (
      <div className="summary-container">
        <h1>Quiz Summary</h1>
        <p>Correct Answers: {correctAnswers.length}</p>
        <p>Incorrect Answers: {incorrectAnswers.length}</p>
        <button onClick={() => dispatch(quiz.actions.restart())}>Restart Quiz</button>
      </div>
    );
  }

  const question = questions[currentQuestionIndex];

  if (!question) {
    return <h1>Oh no! I could not find the current question!</h1>;
  }

  const handleAnswerSubmit = (answerIndex) => {
    dispatch(quiz.actions.submitAnswer({ questionId: question.id, answerIndex }));
    dispatch(quiz.actions.goToNextQuestion());
  };

  return (
    <div key={currentQuestionIndex} className="questions-container fadeInDown">
      <h1>
        Question {currentQuestionIndex + 1} / {questions.length}
      </h1>
      <h2>{question.questionText}</h2>
      <ul>
        {question.options.map((option, index) => (
          <li key={index}>
            <button onClick={() => handleAnswerSubmit(index)}>{option}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
