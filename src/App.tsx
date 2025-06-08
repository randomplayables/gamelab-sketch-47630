import React, { useState } from 'react';
import './styles.css';

const getRandomNumber = (): number => Math.floor(Math.random() * 100) + 1;

export default function App() {
  const [target, setTarget] = useState<number>(getRandomNumber());
  const [guess, setGuess] = useState<string>('');
  const [message, setMessage] = useState<string>('Enter a number between 1 and 100');
  const [attempts, setAttempts] = useState<number>(0);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuess(e.target.value);
  };

  const handleGuess = () => {
    const numGuess = parseInt(guess, 10);
    if (isNaN(numGuess)) {
      setMessage('Please enter a valid number.');
      return;
    }
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (numGuess === target) {
      setMessage(`Correct! You guessed it in ${newAttempts} ${newAttempts === 1 ? 'try' : 'tries'}.`);
      setIsCorrect(true);
      if (typeof window.sendDataToGameLab === 'function') {
        window.sendDataToGameLab({ type: 'guessResult', attempts: newAttempts });
      }
    } else if (numGuess < target) {
      setMessage('Too low! Try again.');
    } else {
      setMessage('Too high! Try again.');
    }
    setGuess('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isCorrect) {
      handleGuess();
    }
  };

  const handleReset = () => {
    setTarget(getRandomNumber());
    setGuess('');
    setMessage('Enter a number between 1 and 100');
    setAttempts(0);
    setIsCorrect(false);
  };

  return (
    <div className="App">
      <h1>Number Guessing Game</h1>
      <p className="message">{message}</p>
      <div className="input-group">
        <input
          type="number"
          value={guess}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={isCorrect}
          placeholder="Your guess"
        />
        <button onClick={handleGuess} disabled={isCorrect}>
          Guess
        </button>
        {isCorrect && (
          <button onClick={handleReset}>
            Play Again
          </button>
        )}
      </div>
      <p className="attempts">Attempts: {attempts}</p>
    </div>
  );
}