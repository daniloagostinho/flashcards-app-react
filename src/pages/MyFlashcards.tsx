import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Flashcard {
  id: number;
  word: string;
  translation: string;
}

const MyFlashcards: React.FC = () => {
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar flashcards salvos
  const loadFlashcards = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8000/flashcards');
      const data = await response.json();
      setFlashcards(data);
    } catch (error) {
      console.error('Erro ao carregar flashcards:', error);
      alert('Erro ao carregar flashcards salvos.');
    } finally {
      setIsLoading(false);
    }
  };

  // Deletar flashcard
  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar este flashcard?')) {
      try {
        const response = await fetch(`http://localhost:8000/flashcards/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setFlashcards(flashcards.filter(card => card.id !== id));
          alert('Flashcard deletado com sucesso!');
        } else {
          alert('Falha ao deletar o flashcard.');
        }
      } catch (error) {
        console.error('Erro ao deletar flashcard:', error);
        alert('Erro ao deletar flashcard.');
      }
    }
  };

  // Carregar flashcards ao montar o componente
  useEffect(() => {
    loadFlashcards();
  }, []);

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
          <h1 className="text-2xl font-bold text-gray-800">📖 Meus Flashcards Salvos</h1>
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
      <div className="flex flex-col items-center min-h-[calc(100vh-120px)]">
        <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
          Seus flashcards salvos
        </h2>

        {/* Botão de atualizar */}
        <button
          onClick={loadFlashcards}
          className="mb-8 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
        >
          <span>🔄</span>
          <span>Atualizar</span>
        </button>

        {/* Loading state */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-xl text-gray-600">Carregando flashcards...</p>
          </div>
        )}

        {/* Lista de flashcards */}
        {!isLoading && flashcards.length > 0 && (
          <div className="w-full max-w-7xl">
            <div className="flex justify-between items-center mb-6">
              <p className="text-lg text-gray-600">
                Total: <span className="font-bold text-blue-600">{flashcards.length}</span> flashcards
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {flashcards.map((card) => (
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

        {/* Estado vazio */}
        {!isLoading && flashcards.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-xl text-gray-600">Nenhum flashcard salvo ainda.</p>
            <p className="text-lg text-gray-500 mt-2">Crie alguns flashcards para vê-los aqui!</p>
            <button
              onClick={() => navigate('/generate')}
              className="mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
            >
              Criar Flashcards
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyFlashcards;
