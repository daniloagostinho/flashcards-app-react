import React, { useState } from 'react';
import { FaCar, FaPlane, FaAppleAlt, FaDog, FaCat } from 'react-icons/fa';

interface IconOptions {
  [key: string]: JSX.Element;
}

const icons: IconOptions = {
  car: <FaCar className="text-primary" size={60} />,
  plane: <FaPlane className="text-primary" size={60} />,
  apple: <FaAppleAlt className="text-primary" size={60} />,
  dog: <FaDog className="text-primary" size={60} />,
  cat: <FaCat className="text-primary" size={60} />,
};

const App: React.FC = () => {
  const [word, setWord] = useState<string>('');
  const [selectedIcon, setSelectedIcon] = useState<JSX.Element | null>(null);
  const [flashcards, setFlashcards] = useState<{ word: string; icon: JSX.Element }[]>([]);

  const handleSearch = () => {
    const icon = icons[word.toLowerCase()];
    if (icon) {
      setSelectedIcon(icon);
    } else {
      alert('No icon found for this word. Try another.');
    }
  };

  const handleConfirm = () => {
    if (selectedIcon) {
      // Prepend the new flashcard to the list
      setFlashcards((prevFlashcards) => [{ word, icon: selectedIcon }, ...prevFlashcards]);
      setWord('');
      setSelectedIcon(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setWord(inputValue);

    if (inputValue === '') {
      setSelectedIcon(null);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-4 sm:p-6 font-poppins text-gray-800">
      <h1 className="text-4xl font-bold mb-6 shadow-sm text-center">
        🎮 English Learning Game 🎉
      </h1>
      <input
        type="text"
        placeholder="Type a word (e.g., car)"
        value={word}
        onChange={handleInputChange}
        className="p-4 w-full sm:w-96 rounded-xl border border-gray-300 text-black text-lg mb-6 shadow-sm"
      />
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={handleSearch}
          disabled={!word.trim()}
          className={`px-6 py-3 rounded-xl text-lg font-semibold ${
            word.trim()
              ? 'bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 shadow-sm'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Search Icon
        </button>
        <button
          onClick={handleConfirm}
          disabled={!selectedIcon}
          className={`px-6 py-3 rounded-xl text-lg font-semibold ${
            selectedIcon
              ? 'bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 shadow-sm'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Confirm
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 w-full max-w-4xl">
        {selectedIcon && (
          <div className="flex flex-col items-center justify-center w-full sm:w-56 h-56 bg-white rounded-3xl shadow-lg p-4">
            {selectedIcon}
            <p className="mt-4 text-xl font-semibold text-gray-800">{word}</p>
          </div>
        )}
        {flashcards.map((card, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center w-full sm:w-56 h-56 bg-white rounded-3xl shadow-lg p-4"
          >
            {card.icon}
            <p className="mt-4 text-xl font-semibold text-gray-800">{card.word}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
