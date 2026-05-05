import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight, FiClock } from "react-icons/fi";

const TestInterface = ({ assessment, onComplete, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(assessment.duration * 60);
  const [submitted, setSubmitted] = useState(false);

  // Mock questions
  const questions = Array.from({ length: assessment.questions }, (_, i) => ({
    id: i + 1,
    question: `Question ${i + 1}: What is ${assessment.skills[0]}?`,
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: Math.floor(Math.random() * 4),
  }));

  const currentQ = questions[currentQuestion];

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleAnswerSelect = (optionIndex) => {
    setAnswers({ ...answers, [currentQuestion]: optionIndex });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    // Calculate score
    let correctCount = 0;
    Object.entries(answers).forEach(([qIdx, ansIdx]) => {
      if (questions[parseInt(qIdx)].correctAnswer === ansIdx) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);
    const timeTaken = assessment.duration * 60 - timeLeft;

    onComplete({
      score,
      correctCount,
      totalQuestions: questions.length,
      timeTaken,
      accuracy: ((correctCount / questions.length) * 100).toFixed(1),
    });
  };

  const isAnswered = answers.hasOwnProperty(currentQuestion);
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Panel - Questions Navigation */}
      <div className="w-64 bg-white border-r border-gray-200 p-6 overflow-y-auto">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900 mb-6 flex items-center gap-2"
        >
          <FiChevronLeft className="w-5 h-5" />
          Back
        </button>

        <h3 className="text-sm font-bold text-gray-900 mb-4">Questions ({answeredCount}/{questions.length})</h3>

        <div className="grid grid-cols-4 gap-2">
          {questions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentQuestion(idx)}
              className={`w-10 h-10 rounded text-sm font-semibold transition-all ${
                idx === currentQuestion
                  ? "bg-purple-600 text-white"
                  : answers.hasOwnProperty(idx)
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header - Timer */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{assessment.title}</h2>
            <p className="text-sm text-gray-600">Question {currentQuestion + 1} of {questions.length}</p>
          </div>

          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold ${
            timeLeft < 300 ? "bg-red-50 text-red-600" : "bg-purple-50 text-purple-600"
          }`}>
            <FiClock className="w-5 h-5" />
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Question Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-2xl">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">{currentQ.question}</h3>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(idx)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all font-semibold ${
                      answers[currentQuestion] === idx
                        ? "border-purple-600 bg-purple-50 text-purple-900"
                        : "border-gray-200 bg-white text-gray-700 hover:border-purple-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          answers[currentQuestion] === idx
                            ? "border-purple-600 bg-purple-600"
                            : "border-gray-300"
                        }`}
                      >
                        {answers[currentQuestion] === idx && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      {option}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Navigation */}
        <div className="bg-white border-t border-gray-200 px-8 py-4 flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <FiChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="px-8 py-2.5 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all"
            >
              Submit Test
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 flex items-center gap-2"
            >
              Next
              <FiChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestInterface;
