import React from 'react';
import { useNavigate } from 'react-router-dom';

const App: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-4 sm:p-6 font-poppins text-gray-800">
      {/* Header com logout */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-800">📚 English Learning</h1>
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

      {/* Conteúdo principal centralizado */}
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-120px)]">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-center">
          Welcome, human being!
        </h1>

        <p className="text-lg text-gray-600 mb-12 text-center">Choose a type of feature to learn English</p>

        {/* Botões organizados em grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          <button
            onClick={() => navigate('/generate')}
            className="group flex flex-col items-center justify-center py-8 px-6 text-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <div className="text-4xl mb-3">✨</div>
            <div>Gerar Flashcards</div>
            <div className="text-sm opacity-90 mt-2">Criar flashcards personalizados</div>
          </button>

          <button
            onClick={() => navigate('/flashcards')}
            className="group flex flex-col items-center justify-center py-8 px-6 text-xl font-semibold text-white bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <div className="text-4xl mb-3">🎯</div>
            <div>Flashcards Prontos</div>
            <div className="text-sm opacity-90 mt-2">Gerar por categorias</div>
          </button>

          <button
            onClick={() => navigate('/my-flashcards')}
            className="group flex flex-col items-center justify-center py-8 px-6 text-xl font-semibold text-white bg-gradient-to-r from-purple-500 to-purple-400 hover:from-purple-600 hover:to-purple-500 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 md:col-span-2"
          >
            <div className="text-4xl mb-3">📖</div>
            <div>Ver meus Flashcards salvos</div>
            <div className="text-sm opacity-90 mt-2">Visualizar e gerenciar seus flashcards</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;