import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importando o hook useNavigate
import { FaSearch } from 'react-icons/fa'; // Importando o ícone de lupa

interface Flashcard {
  word: string;
  iconUrl: string;
}

const FlashcardsList: React.FC = () => {

  const [categorias, setCategorias] = useState<string[]>([]); // Estado para armazenar as categorias
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate(); // Usando o hook useNavigate para navegação

  // Função para buscar os flashcards baseados nas categorias
  const handleGenerateFlashcards = async () => {
    if (categorias.length === 0) {
      alert('Por favor, adicione algumas categorias.');
      return;
    }

    setIsLoading(true); // Inicia o loading

    try {
      const response = await fetch('https://backend-flashcards-app.vercel.app/flashcards-gerados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categorias }),
      });

      if (response.ok) {
        const flashcardsData = await response.json();
        setFlashcards(flashcardsData); // Atualiza os flashcards com múltiplos ícones por categoria
      } else {
        alert('Falha ao gerar flashcards.');
      }
    } catch (error) {
      console.error('Erro ao gerar flashcards:', error);
      alert('Falha ao gerar flashcards.');
    } finally {
      setIsLoading(false); // Finaliza o loading
    }
  };

  // Função para adicionar novas categorias
  const handleAddCategory = (category: string) => {
    if (category.trim() && !categorias.includes(category)) {
      setCategorias((prev) => [...prev, category.trim()]);
    }
  };

  // Função para remover categorias
  const handleRemoveCategory = (category: string) => {
    setCategorias(categorias.filter((cat) => cat !== category));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); // Navegar para a página de login
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-4 sm:p-6 font-poppins text-gray-800">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text">
        🎮 English Learning Game 🎉
      </h1>

      {/* Adicionar categorias */}
      <div className="mb-6 flex items-center">
        <input
          type="text"
          placeholder="Add a category (e.g., animals)"
          className="w-full sm:w-2/3 lg:w-1/2 h-12 px-6 text-lg font-semibold text-gray-700 placeholder-gray-500 bg-white border-4 border-transparent rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAddCategory(e.currentTarget.value);
              e.currentTarget.value = ''; // Limpa o campo após adicionar
            }
          }}
        />

        {/* Lupa para adicionar categoria */}
        <button
          onClick={() => {
            const input = document.querySelector('input[type="text"]') as HTMLInputElement;
            handleAddCategory(input.value);
            input.value = ''; // Limpa o campo após adicionar
          }}
          className="ml-2 p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
        >
          <FaSearch className="h-6 w-6" />
        </button>
      </div>

      {/* Exibir categorias adicionadas */}
      <div className="flex gap-4 mb-6">
        {categorias.map((category, index) => (
          <span
            key={index}
            className="px-4 py-2 bg-blue-500 text-white rounded-full cursor-pointer"
            onClick={() => handleRemoveCategory(category)}
          >
            {category} ✖
          </span>
        ))}
      </div>

      {/* Botão para gerar flashcards */}
      <button
        onClick={handleGenerateFlashcards}
        disabled={categorias.length === 0 || isLoading}
        className={`px-6 py-3 rounded-xl text-lg font-semibold flex items-center justify-center mt-4 ${categorias.length === 0 || isLoading
          ? 'bg-gray-400 cursor-not-allowed text-white'
          : 'bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 shadow-md text-white'
          }`}
      >
        {isLoading ? 'Gerando...' : 'Gerar Flashcards'}
      </button>

      {/* Exibição dos flashcards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 w-full max-w-4xl">
        {flashcards.length > 0 ? (
          flashcards.map((card, index) => (
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
          ))
        ) : (
          <p className="text-xl text-gray-700 w-full text-center">
            Nenhum flashcard gerado ainda. Adicione categorias e gere-os.
          </p>

        )}
      </div>
    </div>
  );
};

export default FlashcardsList;
