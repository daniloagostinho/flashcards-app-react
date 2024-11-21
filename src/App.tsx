import React, { useEffect, useState } from 'react';

interface Flashcard {
  word: string;
  iconUrl: string;
}

const App: React.FC = () => {
  const [word, setWord] = useState<string>('');
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await fetch('https://backend-flashcards-app.vercel.app/flashcards');
        const data = await response.json();
        setFlashcards(data);
      } catch (error) {
        console.error('Error fetching flashcards:', error);
      }
    };

    fetchFlashcards();
  }, []);

  const handleSearch = async () => {
    if (!word.trim()) {
      alert('Please enter a word.');
      return;
    }

    try {
      const response = await fetch(`https://api.iconify.design/search?query=${encodeURIComponent(word.toLowerCase())}`);
      if (response.ok) {
        const data = await response.json();
        if (data.icons && data.icons.length > 0) {
          const iconName = data.icons[0];
          const iconUrl = `https://api.iconify.design/${iconName}.svg`;
          setIconUrl(iconUrl);
        } else {
          alert('No icon found for this word. Try another.');
          setIconUrl(null);
        }
      } else {
        alert('Failed to fetch icon. Please try again.');
        setIconUrl(null);
      }
    } catch (error) {
      console.error('Error fetching icon:', error);
      alert('Failed to fetch icon. Please try again.');
      setIconUrl(null);
    }
  };

  const handleConfirm = async () => {
    if (iconUrl) {
      try {
        const newFlashcard = { word, iconUrl };
        const response = await fetch('https://backend-flashcards-app.vercel.app/flashcards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newFlashcard),
        });

        if (response.ok) {
          const savedFlashcard = await response.json();
          setFlashcards((prevFlashcards) => [savedFlashcard, ...prevFlashcards]);
          setWord('');
          setIconUrl(null);
        } else {
          alert('Failed to save flashcard.');
        }
      } catch (error) {
        console.error('Error saving flashcard:', error);
        alert('Failed to save flashcard.');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWord(e.target.value);

    if (e.target.value === '') {
      setIconUrl(null);
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
          disabled={!iconUrl}
          className={`px-6 py-3 rounded-xl text-lg font-semibold ${
            iconUrl
              ? 'bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 shadow-sm'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Confirm
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 w-full max-w-4xl">
        {flashcards.map((card, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center w-full sm:w-56 h-56 bg-white rounded-3xl shadow-lg p-4"
          >
            <div
              className="w-32 h-32 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full flex items-center justify-center"
              style={{
                maskImage: `url(${card.iconUrl})`,
                maskSize: 'cover',
                WebkitMaskImage: `url(${card.iconUrl})`,
                WebkitMaskSize: 'cover',
              }}
            ></div>
            <p className="mt-4 text-xl font-semibold text-gray-800">{card.word}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
