import React, { useState } from 'react';
import './Quiz.css';

const Quiz = () => {
  const [question] = useState('What is the capital of France?');
  const [options] = useState(['Paris', 'London', 'Rome', 'Berlin']);
  const [correctAnswer] = useState('Paris');
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleOptionSelect = (selectedOption) => {
    setSelectedAnswer(selectedOption);
    if (selectedOption === correctAnswer) {
      setFeedback('Correct!');
    } else {
      setFeedback('Incorrect. Try again!');
    }
  };

  return (
    <div className="quiz-container">
      <h2 className="quiz-question">{question}</h2>
      <div className="quiz-options">
        {options.map((option, index) => (
          <button
            key={index}
            className={`quiz-option ${selectedAnswer === option ? 'selected' : ''}`}
            onClick={() => handleOptionSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>
      {feedback && <p className="quiz-feedback">{feedback}</p>}
    </div>
  );
};

export default Quiz;
