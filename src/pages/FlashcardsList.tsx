import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importando o hook useNavigate
import { FaSearch } from 'react-icons/fa'; // Importando o ícone de lupa

interface Flashcard {
  id: number;
  word: string;
  translation: string;
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
      const response = await fetch('http://localhost:8000/flashcards-gerados', {
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

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar este flashcard?')) {
      try {
        const response = await fetch(`http://localhost:8000/flashcards/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setFlashcards(flashcards.filter(card => card.id !== id));
        } else {
        }
      } catch (error) {
        console.error('Erro ao deletar flashcard:', error);
        alert('Erro ao deletar flashcard.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-4 sm:p-6 font-poppins text-gray-800">
      {/* Header com navegação */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/app')}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
          >
            <span>←</span>
            <span>Voltar</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-800">🎯 Flashcards Prontos</h1>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            navigate('/login');
          }}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>

      {/* Conteúdo principal */}
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-120px)]">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
          Gere flashcards por categorias
        </h2>

        {/* Adicionar categorias */}
        <div className="w-full max-w-2xl mb-8">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Digite uma categoria (ex: animals, colors, food)"
              className="flex-1 h-12 px-6 text-lg font-semibold text-gray-700 placeholder-gray-500 bg-white border-4 border-transparent rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddCategory(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
            <button
              onClick={() => {
                const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                handleAddCategory(input.value);
                input.value = '';
              }}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 transform hover:scale-105"
            >
              <span>➕</span>
              <span>Adicionar</span>
            </button>
          </div>
        </div>

        {/* Exibir categorias adicionadas */}
        {categorias.length > 0 && (
          <div className="w-full max-w-4xl mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Categorias selecionadas:</h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {categorias.map((category, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-blue-500 text-white rounded-full cursor-pointer hover:bg-blue-600 transition-colors duration-200 flex items-center space-x-2"
                  onClick={() => handleRemoveCategory(category)}
                >
                  <span>{category}</span>
                  <span>✖</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Botão para gerar flashcards */}
        <button
          onClick={handleGenerateFlashcards}
          disabled={categorias.length === 0 || isLoading}
          className={`px-8 py-4 rounded-xl text-xl font-semibold flex items-center space-x-2 transition-all duration-300 ${
            categorias.length > 0 && !isLoading
              ? 'bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 text-white transform hover:scale-105'
              : 'bg-gray-400 cursor-not-allowed text-white'
          }`}
        >
          <span>{isLoading ? '⏳' : '🎯'}</span>
          <span>{isLoading ? 'Gerando...' : 'Gerar Flashcards'}</span>
        </button>

        {/* Exibição dos flashcards */}
        {flashcards.length > 0 && (
          <div className="w-full max-w-6xl mt-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Seus Flashcards Gerados:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {flashcards.map((card, index) => (
                <div
                  key={card.id}
                  className="relative flex flex-col items-center justify-center w-full h-48 bg-white rounded-3xl shadow-lg p-4 transform hover:scale-105 transition-all duration-300"
                >
                  <button
                    onClick={() => handleDelete(card.id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-200"
                    title="Deletar flashcard"
                  >
                    ×
                  </button>
                  <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                    <div className="text-4xl">📚</div>
                  </div>
                  <p className="mt-4 text-lg font-semibold text-gray-800 text-center">{card.word}</p>
                  <p className="text-base text-blue-600 font-semibold mt-2 text-center">{card.translation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {flashcards.length === 0 && categorias.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-xl text-gray-600">Nenhum flashcard gerado ainda.</p>
            <p className="text-lg text-gray-500 mt-2">Adicione categorias e gere flashcards automaticamente!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashcardsList;
