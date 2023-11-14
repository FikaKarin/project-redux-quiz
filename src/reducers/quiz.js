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
    imageURL: 'https://pngimg.com/uploads/peter_pan/peter_pan_PNG2.png',
  },
  {
    id: 3,
    questionText: "Who is the villain in 'The Little Mermaid'?",
    options: ['Ursula', 'Maleficent', 'Cruella de Vil', 'Gaston'],
    correctAnswerIndex: 0,
    imageURL: 'https://pngimg.com/uploads/ariel/ariel_PNG7.png',
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
    // ... (your existing reducers)

    /**
     * Use this action when a user selects an answer to the question.
     * The answer will be stored in the `quiz.answers` state with the
     * following values:
     *
     *    questionId  - The id of the question being answered.
     *    answerIndex - The index of the selected answer from the question's options.
     *    question    - A copy of the entire question object, to make it easier to show
     *                  details about the question in your UI.
     *    answer      - The answer string.
     *    isCorrect   - true/false if the answer was the one which the question says is correct.
     *
     * When dispatching this action, you should pass an object as the payload with `questionId`
     * and `answerIndex` keys. See the readme for more details.
     */
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

      // Update the score based on correctness
      if (isCorrect) {
        state.score += 1; // Add a point for correct answers
      } else {
        // Deduct points for incorrect answers (you can adjust the value)
        state.score -= 1;
      }
    },

    /**
     * Use this action to progress the quiz to the next question. If there's
     * no more questions (the user was on the final question), set `quizOver`
     * to `true`.
     *
     * This action does not require a payload.
     */
    goToNextQuestion: (state) => {
      if (state.score < 0) {
        // If the user's score is negative, reset it to 0
        state.score = 0;
      }

      // Calculate the threshold for the minimum score required to continue
      const threshold = Math.ceil(state.questions.length / 2);

      const remainingQuestions =
        state.questions.length - (state.currentQuestionIndex + 1);
      if (state.score + remainingQuestions >= threshold) {
        // If it's possible, go to the next question
        state.currentQuestionIndex += 1;
      } else if (state.currentQuestionIndex + 1 === state.questions.length) {
        // If it's the last question, end the quiz
        state.quizOver = true;
      } else {
        // If it's not the last question and the score is below the threshold, end the quiz
        state.quizOver = true;
      }
    },

    /**
     * Use this action to reset the state to the initial state the page had
     * when it was loaded. Who doesn't like re-doing a quiz when you know the
     * answers?!
     *
     * This action does not require a payload.
     */
    restart: () => {
      return initialState;
    },

    /**
     * Use this action to set the quiz as over. This action should be
     * dispatched when the user's score is below a certain threshold.
     *
     * This action does not require a payload.
     */
    quizOver: (state) => {
      state.quizOver = true;
      state.currentQuestionIndex = state.questions.length; // Set the index to a value that's out of bounds
    },
  },
});
