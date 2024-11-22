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
        console.error('Erro ao buscar flashcards:', error);
      }
    };

    fetchFlashcards();
  }, []);

  const handleSearch = async () => {
    if (!word.trim()) {
      alert('Por favor, introduza uma word.');
      return;
    }

    try {
      const response = await fetch(
        `https://api.iconify.design/search?query=${encodeURIComponent(word.toLowerCase())}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.icons && data.icons.length > 0) {
          const iconName = data.icons[0];
          const iconUrl = `https://api.iconify.design/${iconName}.svg`;
          setIconUrl(iconUrl); // Define o URL do ícone imediatamente
        } else {
          alert('Nenhum ícone encontrado para esta palavra. Tente outro.');
          setIconUrl(null);
        }
      } else {
        alert('Falha ao obter o ícone. Por favor, tente novamente.');
        setIconUrl(null);
      }
    } catch (error) {
      console.error('Erro ao buscar o ícone:', error);
      alert('Falha ao obter o ícone. Por favor, tente novamente.');
      setIconUrl(null);
    }
  };

  const handleSave = async () => {
    if (iconUrl) {
      try {
        const newFlashcard = { word: word, iconUrl };
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
          alert('Falha ao salvar o flashcard.');
        }
      } catch (error) {
        console.error('Erro ao guardar o flashcard:', error);
        alert('Falha ao salvar o flashcard.');
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
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-4 sm:p-6 font-poppins text-gray-800">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text">
        🎮 English Learning Game 🎉
      </h1>
      <input
        type="text"
        placeholder="Type a word (e.g., car)"
        value={word}
        onChange={handleInputChange}
        className="w-full sm:w-2/3 lg:w-1/2 h-16 px-6 text-2xl font-semibold text-gray-700 placeholder-gray-500 bg-white border-4 border-transparent rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
      />
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={handleSearch}
          disabled={!word.trim()}
          className={`px-6 py-3 rounded-xl text-lg font-semibold flex items-center justify-center mt-4 ${word.trim()
            ? 'bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 shadow-md text-white'
            : 'bg-gray-400 cursor-not-allowed text-white'
            }`}
        >
          Search Icon
        </button>
        <button
          onClick={handleSave}
          disabled={!iconUrl}
          className={`px-6 py-3 rounded-xl text-lg font-semibold flex items-center justify-center mt-4 ${iconUrl
            ? 'bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 shadow-md text-white'
            : 'bg-gray-400 cursor-not-allowed text-white'
            }`}
        >
          Save
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 w-full max-w-4xl">
        {iconUrl && (
          <div className="flex flex-col items-center justify-center w-full sm:w-56 h-56 bg-white rounded-3xl shadow-lg p-4">
            <div
              className="w-32 h-32 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full flex items-center justify-center"
              style={{
                maskImage: `url(${iconUrl})`,
                maskSize: 'cover',
                WebkitMaskImage: `url(${iconUrl})`,
                WebkitMaskSize: 'cover',
              }}
            ></div>
            <p className="mt-4 text-xl font-semibold text-gray-800">{word}</p>
          </div>
        )}
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
