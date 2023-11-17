import { createSlice } from '@reduxjs/toolkit';
import mary from '../assets/mary.png';
import pinocchio from '../assets/pinocchio.png';
import lion from '../assets/lion.png';
import beauty from '../assets/beauty.png';
import jasmine from '../assets/jasmine.png';
import bambi from '../assets/bambi.png';

const questions = [
  {
    id: 1,
    questionText:
      'In which Disney movie does a young lion become king of the Pride Lands?',
    options: [
      'The Little Mermaid',
      'Beauty and the Beast',
      'The Lion King',
      'Aladdin',
    ],
    correctAnswerIndex: 2,
    imageURL: lion,
  },
  {
    id: 2,
    questionText: 'What is the name of the fairy in Peter Pan?',
    options: ['Tinker Bell', 'Silvermist', 'Periwinkle', 'Fawn'],
    correctAnswerIndex: 0,
    imageURL:
      'https://pngimg.com/uploads/peter_pan/peter_pan_PNG2.png',
  },
  {
    id: 3,
    questionText: "Who is the villain in 'The Little Mermaid'?",
    options: ['Ursula', 'Maleficent', 'Cruella de Vil', 'Gaston'],
    correctAnswerIndex: 0,
    imageURL:
      'https://pngimg.com/uploads/ariel/ariel_PNG7.png',
  },
  {
    id: 4,
    questionText: "What is the name of the magical nanny in 'Mary Poppins'?",
    options: ['Nanny McPhee', 'Mrs. Doubtfire', 'Mary Poppins', 'Annie'],
    correctAnswerIndex: 2,
    imageURL: mary,
  },
  {
    id: 5,
    questionText:
      'Which Disney movie features a wooden boy whose nose grows longer when he lies?',
    options: [
      'Cinderella',
      'Snow White and the Seven Dwarfs',
      'Pinocchio',
      'Dumbo',
    ],
    correctAnswerIndex: 2,
    imageURL: pinocchio,
  },
  {
    id: 6,
    questionText: "What is the name of the princess in 'Beauty and the Beast'?",
    options: ['Ariel', 'Belle', 'Jasmine', 'Cinderella'],
    correctAnswerIndex: 1,
    imageURL: beauty,
  },
  {
    id: 7,
    questionText: "In 'Aladdin', what is the name of the princess?",
    options: ['Aurora', 'Jasmine', 'Rapunzel', 'Merida'],
    correctAnswerIndex: 1,
    imageURL: jasmine,
  },
  {
    id: 8,
    questionText: "What kind of animal is Thumper in 'Bambi'?",
    options: ['Rabbit', 'Skunk', 'Deer', 'Squirrel'],
    correctAnswerIndex: 0,
    imageURL: bambi,
  },
];

const initialState = {
  questions,
  answers: [],
  currentQuestionIndex: 0,
  quizOver: false,
  score: 0,
};

export const quiz = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    submitAnswer: (state, action) => {
      const { questionId, answerIndex, isCorrect } = action.payload;
      const question = state.questions.find((q) => q.id === questionId);

      if (!question) {
        throw new Error(
          'Could not find question! Check to make sure you are passing the question id correctly.'
        );
      }

      if (question.options[answerIndex] === undefined) {
        throw new Error(
          `You passed answerIndex ${answerIndex}, but it is not in the possible answers array!`
        );
      }

      state.answers.push({
        questionId,
        answerIndex,
        question,
        answer: question.options[answerIndex],
        isCorrect,
      });

      if (isCorrect) {
        state.score += 1;
      } else {
        if (state.score > 0) {
          state.score -= 1;
        }
      }
    },
    goToNextQuestion: (state) => {
      if (state.score < 0) {
        state.score = 0;
      }
    
      state.currentQuestionIndex += 1;
    
      if (state.currentQuestionIndex === state.questions.length) {
        state.quizOver = true;
      }
    },
       

    restart: () => {
      return initialState;
    },

    quizOver: (state) => {
      state.quizOver = true;
      state.currentQuestionIndex = state.questions.length;
    },

    incrementScore: (state) => {
      const currentQuestion =
        state.currentQuestionIndex < state.questions.length
          ? state.questions[state.currentQuestionIndex]
          : null;
    
      const currentAnswer = currentQuestion
        ? state.answers.find((answer) => answer.questionId === currentQuestion.id)
        : null;
    
      if (currentQuestion && currentAnswer && currentAnswer.answerIndex === currentQuestion.correctAnswerIndex) {
        state.score += 1;
      }
    },
    
    
    decrementScore: (state) => {
      const currentQuestion = state.questions[state.currentQuestionIndex];
      const currentAnswer = state.answers.find(
        (answer) => answer.questionId === currentQuestion.id
      );
    
      if (currentQuestion && currentAnswer && state.score > 0 && currentAnswer.answerIndex === currentQuestion.correctAnswerIndex) {
        state.score -= 1;
      }
    },    
    
  },
});