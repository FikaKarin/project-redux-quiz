import { createSlice } from "@reduxjs/toolkit";

const questions = [
  {
    id: 1,
    questionText: "In which Disney movie does a young lion become king of the Pride Lands?",
    options: ["The Little Mermaid", "Beauty and the Beast", "The Lion King", "Aladdin"],
    correctAnswerIndex: 2
  },
  {
    id: 2,
    questionText: "What is the name of the fairy in Peter Pan?",
    options: ["Tinker Bell", "Silvermist", "Periwinkle", "Fawn"],
    correctAnswerIndex: 0
  },
  {
    id: 3,
    questionText: "Who is the villain in 'The Little Mermaid'?",
    options: ["Ursula", "Maleficent", "Cruella de Vil", "Gaston"],
    correctAnswerIndex: 0
  },
  {
    id: 4,
    questionText: "What is the name of the magical nanny in 'Mary Poppins'?",
    options: ["Nanny McPhee", "Mrs. Doubtfire", "Mary Poppins", "Annie"],
    correctAnswerIndex: 2
  },
  {
    id: 5,
    questionText: "Which Disney movie features a wooden boy whose nose grows longer when he lies?",
    options: ["Cinderella", "Snow White and the Seven Dwarfs", "Pinocchio", "Dumbo"],
    correctAnswerIndex: 2
  },
  {
    id: 6,
    questionText: "What is the name of the princess in 'Beauty and the Beast'?",
    options: ["Ariel", "Belle", "Jasmine", "Cinderella"],
    correctAnswerIndex: 1
  },
  {
    id: 7,
    questionText: "In 'Aladdin', what is the name of the princess?",
    options: ["Aurora", "Jasmine", "Rapunzel", "Merida"],
    correctAnswerIndex: 1
  },
  {
    id: 8,
    questionText: "What kind of animal is Thumper in 'Bambi'?",
    options: ["Rabbit", "Skunk", "Deer", "Squirrel"],
    correctAnswerIndex: 0
  },
];

const initialState = {
  questions,
  answers: [],
  currentQuestionIndex: 0,
  quizOver: false
};

export const quiz = createSlice({
  
  name: "quiz",
  initialState,
  reducers: {
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
      const { questionId, answerIndex } = action.payload;
      const question = state.questions.find((q) => q.id === questionId);

      if (!question) {
        throw new Error(
          "Could not find question! Check to make sure you are passing the question id correctly."
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
        isCorrect: question.correctAnswerIndex === answerIndex
      });
    },

    /**
     * Use this action to progress the quiz to the next question. If there's
     * no more questions (the user was on the final question), set `quizOver`
     * to `true`.
     *
     * This action does not require a payload.
     */
    goToNextQuestion: (state) => {
      if (state.currentQuestionIndex + 1 === state.questions.length) {
        state.quizOver = true;
      } else {
        state.currentQuestionIndex += 1;
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
    }
  }
});