import React, { useEffect, useState } from 'react';

interface Flashcard {
  word: string;
  imageUrl: string;
}

const App: React.FC = () => {
  const [word, setWord] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
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
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(word.toLowerCase())}&per_page=1`,
        {
          headers: {
            Authorization: `78x0tju6NTslUCiEUN93M3nijFQO0sndMLQBIQ0Gfxo`, // Replace with your Unsplash API key
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const imageUrl = data.results[0].urls.small; // Use the first image result
          setImageUrl(imageUrl);
        } else {
          alert('No image found for this word. Try another.');
          setImageUrl(null);
        }
      } else {
        alert('Failed to fetch image. Please try again.');
        setImageUrl(null);
      }
    } catch (error) {
      console.error('Error fetching image:', error);
      alert('Failed to fetch image. Please try again.');
      setImageUrl(null);
    }
  };

  const handleSave = async () => {
    if (imageUrl) {
      try {
        const newFlashcard = { word, imageUrl };
        const response = await fetch('https://backend-flashcards-app.vercel.app/flashcards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newFlashcard),
        });

        if (response.ok) {
          const savedFlashcard = await response.json();
          setFlashcards((prevFlashcards) => [savedFlashcard, ...prevFlashcards]);
          setWord('');
          setImageUrl(null);
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
      setImageUrl(null);
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
          Search Image
        </button>
        <button
          onClick={handleSave}
          disabled={!imageUrl}
          className={`px-6 py-3 rounded-xl text-lg font-semibold ${
            imageUrl
              ? 'bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 shadow-sm'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Save
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 w-full max-w-4xl">
        {imageUrl && (
          <div className="flex flex-col items-center justify-center w-full sm:w-56 h-56 bg-white rounded-3xl shadow-lg p-4">
            <img src={imageUrl} alt={word} className="w-32 h-32 object-contain rounded-lg" />
            <p className="mt-4 text-xl font-semibold text-gray-800">{word}</p>
          </div>
        )}
        {flashcards.map((card, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center w-full sm:w-56 h-56 bg-white rounded-3xl shadow-lg p-4"
          >
            <img src={card.imageUrl} alt={card.word} className="w-32 h-32 object-contain rounded-lg" />
            <p className="mt-4 text-xl font-semibold text-gray-800">{card.word}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
